// MIT License

// Copyright 2019-present, Digital Government Development Agency (Public Organization) 

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
"use strict";

const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const base64url = require('base64url')
const promise = require('promise');
const {
    logger
} = require('../../../commons/logger');
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
var passHash = require('password-hash');
const mysqlHelper = require('../../helpers/mysql');
const redisHelper = require('../../helpers/redis');

function login(req, res) {

    var ctx = req.body;
    const username = ctx.username;

    if (username === undefined) {
        http.error(res, 401, 401000, "not found username");
        return;
    }

    const password = ctx.password;
    if (password === undefined) {
        http.error(res, 401, 401000, "not found password");
        return;
    }

    var token = base64url(crypto.randomBytes(48));

    const qstr = "SELECT * " +
        "FROM users " +
        "JOIN user_profile on users.user_id = user_profile.user_id " +
        "JOIN department on department.dep_id = user_profile.dep_id " +
        "JOIN ministry on ministry.ministry_code = user_profile.ministry_code " +
        "JOIN roles on roles.role_id = users.role_id " +
        "WHERE users.username = '" + username + "'";

    mysqlHelper.getConnection()
        .then(conn => {
            return mysqlHelper.query(conn, qstr)
                .then(results => {
                    
                    let compose_error = (h, e, d) => {
                        return {
                            httpCode: h,
                            errorCode: e,
                            desc: d
                        };
                    }
                    
                    if (results.length > 0) {

                        logger.debug("user profile: " + JSON.stringify(results));

                        if (!passHash.verify(password, results[0].password)) {
                            conn.destroy();
                            return Promise.reject(compose_error(400, 40000, "invalid password"));
                        } else if (results[0].delete_flag !== undefined && results[0].delete_flag == 1) {
                            conn.destroy();
                            return Promise.reject(compose_error(401, 40105, "this user was deleted"));
                        } else if (results[0].suspended_flag !== undefined && results[0].suspended_flag == 1) {
                            conn.destroy();
                            return Promise.reject(compose_error(401, 40104, "this user was disabled"));
                        } else if (results[0].approval_status !== undefined && results[0].approval_status === "reject") {
                            conn.destroy();
                            return Promise.reject(compose_error(401, 40103, "this user was rejected"));
                        } else if (results[0].approval_status !== undefined && results[0].approval_status === "waiting") {
                            conn.destroy();
                            return Promise.reject(compose_error(401, 40106, "this user is waiting for approval"));
                        } else if (results[0].approval_status !== undefined && !(results[0].approval_status === "waiting" || results[0].approval_status === "reject" || results[0].approval_status === "approve")) {
                            conn.destroy();
                            return Promise.reject(compose_error(500, 50000, "unknown approval status: " + results[0].approval_status));
                        } else {
                            conn.destroy();
                            return Promise.resolve(results[0]);
                        }
                    } else {
                        conn.destroy();
                        return Promise.reject(compose_error(404, 40401, "not found an user"));
                    }
                });

        })
        .then(usrDetails => {
            return redisHelper.getRedisConnection()
                .then(redisCli => {
                    return redisHelper.redisSet(redisCli, username, token, 60 * appConf.tokenExpiredTime)
                        .then(reply => {
                            return Promise.resolve(usrDetails);
                        })
                        .catch(err => {
                            return Promise.reject({
                                httpCode: 500,
                                errorCode: 50002,
                                desc: "cannot write token on redis: " + err
                            });
                        });
                });
        })
        .then(userDetails => {
            let options = {
                maxAge: 1000 * 60 * appConf.tokenExpiredTime, // would expire after 15 minutes
                httpOnly: true, // The cookie only accessible by the web server
                signed: appConf.cookies.signed // Indicates if the cookie should be signed
            }

            res.cookie('userid', userDetails.user_id, options);
            res.cookie('username', userDetails.username, options);
            res.cookie('token', token, options);

            http.success(res, {
                userid: userDetails.user_id,
                user: userDetails.username,
                name: userDetails.firstname,
                surname: userDetails.lastname,
                nameEN: "",
                surnameEN: "",
                nickName: "",
                tel: userDetails.office_phone,
                ext: userDetails.ext,
                mobile: userDetails.mobile,
                email: userDetails.email,
                position: userDetails.position,
                organize: userDetails.org_name,
                department: userDetails.dep_name,
                devision: "",
                role: userDetails.role_name
            });
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                http.error(res, err.httpCode, err.errorCode, err.desc);
            } else {
                http.error(res, 500, 50002, err);
            }
        });
}

module.exports = {
    login
}