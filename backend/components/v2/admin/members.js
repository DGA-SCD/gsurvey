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
const {
    logger
} = require('../../../commons/logger');
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
const promise = require('promise');
const redis = require("redis");
const mysqlHelper = require('../../helpers/mysql');
const mailHeler = require('../../helpers/mail');


function getMembers(req, res) {
    let userId = req.signedCookies['userid'];

    if (userId === undefined || userId === "") {
        http.error(res, 401, 40100, 'unauthorized user');
        return;
    }

    const qstr_validator = "SELECT R.role_name " + 
    "FROM users as U " +
    "INNER JOIN roles as R ON R.role_id = U.role_id " +
    "WHERE U.user_id = \'" + userId + "\'";

    const qstr_getMember = "SELECT U.user_id, username, PF.prefix_name, P.firstname, P.lastname, P.email, P.mobile, P.office_phone, P.ext, M.ministry_name as min_name, D.dep_name, O.org_name, P.suspended_flag as suspension_status, P.approval_status, P.approved_by " +
        "FROM users as U INNER JOIN user_profile as P on U.user_id = P.user_id " +
        "LEFT JOIN department as D ON D.dep_id = P.dep_id " +
        "LEFT JOIN ministry as M ON M.ministry_code = P.ministry_code " +
        "LEFT JOIN organization as O ON O.org_code = P.org_code " +
        "LEFT JOIN prefix as PF ON PF.prefix_id = P.prefix_id " +
        "WHERE P.delete_flag = 0";

    return mysqlHelper.getConnection()
        .then(conn =>{
            return mysqlHelper.query(conn, qstr_validator)
            .then( result => {
                if( result.length < 0 || result[0].role_name === undefined || result[0].role_name !== 'system admin'){
                    return Promise.reject({
                        httpCode: 401,
                        errorCode: 40100,
                        desc: "unauthorized user"
                    });
                }
                else{
                    logger.debug("query member: user granted");
                    return Promise.resolve(conn);
                }
            });
        })
        .then(conn => {
            return mysqlHelper.query(conn, qstr_getMember)
                .then(results => {
                    http.success(res, results);
                    conn.detroy();
                    return Promise.resolve(results.length)
                })
                .catch(err => {
                    return Promise.reject({
                        httpCode: 500,
                        errorCode: 50002,
                        desc: "Cannot query member: " + err
                    });
                });
        })
        .then(result_length => {
            logger.debug("query members: " + result_length + " records");
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('member inquery: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'member inquery: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('member inquery:: ' + err));
                logger.error('member inquery: ' + err);
            }
        });
}

function setApproval(req, res) {

}

function setSuspension(req, res) {

}

function deleteMember(req, res) {

}

module.exports = {
    getMembers,
    setApproval,
    setSuspension,
    deleteMember,
};