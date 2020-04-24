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

const helperMySQL = require('../../helpers/mysql');
const {
    logger
} = require('../../../commons/logger');
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
const {
    changePassword
} = require('../users/password');

// Get User profile 
function getProfile(req, res) {

    let userName = req.signedCookies['username']; //req.USERNAME;

    if (userName === undefined) {
        http.error(res, 401, 40100, 'required authentication');
        return;
    }

    const qstr = "SELECT prefix_id, P.firstname, P.lastname, position, email, ministry_name as ministry, dep_name as department, org_name as  organization, mobile, office_phone, ext, role_name as role " +
        "FROM users as U " +
        "INNER JOIN user_profile  as P on U.user_id = P.user_id " +
        "LEFT JOIN department on department.dep_id = P.dep_id " +
        "LEFT JOIN ministry on ministry.ministry_code = P.ministry_code " +
        "LEFT JOIN organization as O on O.org_code = P.org_code " +
        "LEFT JOIN roles on roles.role_id = U.role_id " +
        "WHERE U.username = '" + userName + "' ";

    helperMySQL.getConnection()
        .then(conn => {
            return helperMySQL.query(conn, qstr)
                .then(results => {
                    if (results.length < 1) {
                        http.error(res, 404, 404000, "Not found user or password");
                        conn.end();
                    } else {
                        http.success(res, results[0]);
                        conn.end();
                    }
                });
        })
        .catch(err => {
            http.error(res, 500, 50002, err);
        });
}

// change password
function changePassord(req, res) {
    req.ctx = {
        userId: req.signedCookies['userid']
    }
    changePassword(req, res);
}

// update profile
function updateProfile(req, res) {

    let userId = req.signedCookies['userid'];

    if (userId === undefined) {
        http.error(res, 401, 40100, 'required authentication');
        return;
    }

    if (req.body.prefix_id === undefined) {
        http.error(res, 404, 40400, 'not found prefix_id');
        return;
    }

    if (req.body.firstname === undefined) {
        http.error(res, 404, 40400, 'not found firstname');
        return;
    }

    if (req.body.lastname === undefined) {
        http.error(res, 404, 40400, 'not found lastname');
        return;
    }

    if (req.body.position === undefined) {
        http.error(res, 404, 40400, 'not found position');
        return;
    }

    if (req.body.mobile === undefined) {
        http.error(res, 404, 40400, 'not found mobile');
        return;
    }

    if (req.body.office_phone === undefined) {
        http.error(res, 404, 40400, 'not found office_phone');
        return;
    }

    if (req.body.ext === undefined) {
        http.error(res, 404, 40400, 'not found ext');
        return;
    }

    let qstr = "UPDATE user_profile SET " +
        "prefix_id=" + req.body.prefix_id + "," +
        "firstname=\'" + req.body.firstname + "\'," +
        "lastname=\'" + req.body.lastname + "\'," +
        "position=\'" + req.body.position + "\'," +
        "mobile=\'" + req.body.mobile + "\'," +
        "office_phone=\'" + req.body.office_phone + "\'," +
        "ext=\'" + req.body.ext + "\' " +
        "WHERE user_profile.user_id=" + userId;

    helperMySQL.getConnection()
        .then(conn => {
            return helperMySQL.query(conn, qstr)
                .then(status => {
                    if (status !== undefined && status.affectedRows == 1) {
                        http.success(res);
                        conn.destroy();
                    } else {
                        http.error(res, 500, 50002, "cannot update profile or not found this profile");
                        conn.destroy();
                    }
                })
        })
        .then(() => {
            logger.debug("update profile success");
        })
        .catch(err => {
            http.error(res, 500, 50002, err);
        });

}

module.exports = {
    getProfile,
    changePassord,
    updateProfile,
};