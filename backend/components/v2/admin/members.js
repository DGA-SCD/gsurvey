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


function validateAdmin(userId) {

    const qstr_validator = "SELECT R.role_name " +
        "FROM users as U " +
        "INNER JOIN roles as R ON R.role_id = U.role_id " +
        "WHERE U.user_id = \'" + userId + "\'";

    return mysqlHelper.getConnection()
        .then(conn => {
            return mysqlHelper.query(conn, qstr_validator)
                .then(result => {
                    if (result.length < 0 || result[0].role_name === undefined || result[0].role_name !== 'system admin') {
                        conn.destroy();
                        return Promise.reject({
                            httpCode: 401,
                            errorCode: 40100,
                            desc: "unauthorized user"
                        });
                    } else {
                        logger.debug("admin validator: pass");
                        return Promise.resolve(conn);
                    }
                });
        });
}

function getMembers(req, res) {
    let userId = req.signedCookies['userid'];

    if (userId === undefined || userId === "") {
        http.error(res, 401, 40100, 'unauthorized user');
        return;
    }

    const qstr_getMember = "SELECT U.user_id, username, PF.prefix_name, P.firstname, P.lastname, P.email, P.mobile, P.office_phone, P.ext, M.ministry_name as min_name, D.dep_name, O.org_name, P.approval_status, P.approved_by, " +
        "CASE P.suspended_flag " +
        "WHEN 1 then \"disable\" " +
        "WHEN 0 then \"enable\" " +
        "END as suspension_status " +
        "FROM users as U INNER JOIN user_profile as P on U.user_id = P.user_id " +
        "LEFT JOIN department as D ON D.dep_id = P.dep_id " +
        "LEFT JOIN ministry as M ON M.ministry_code = P.ministry_code " +
        "LEFT JOIN organization as O ON O.org_code = P.org_code " +
        "LEFT JOIN prefix as PF ON PF.prefix_id = P.prefix_id " +
        "WHERE P.delete_flag = 0 and U.role_id > 0 and U.user_id != \'" + userId + "\'";

    return validateAdmin(userId)
        .then(conn => {
            return mysqlHelper.query(conn, qstr_getMember)
                .then(results => {
                    http.success(res, results);
                    conn.destroy();
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

    let userId = req.signedCookies['userid'];;

    if (userId === undefined || userId === "") {
        http.error(res, 401, 40100, 'unauthorized user');
        return;
    }

    if (req.body.userid === undefined || req.body.userid === "") {
        http.error(res, 404, 40400, 'not found userid');
        return;
    }

    if (req.body.email === undefined || req.body.email === "") {
        http.error(res, 404, 40400, 'not found email');
        return;
    }

    if (req.body.action === undefined || req.body.action === "") {
        http.error(res, 404, 40400, 'not found action');
        return;
    }

    let desc = "ไม่ระบุ";

    if (!(req.body.desc === undefined || req.body.desc === "")) {
        desc = req.body.desc;
    }

    let memberId = req.body.userid;
    let action = req.body.action;
    let email = req.body.email;

    if (!(action !== "approve" || action !== "reject")) {
        http.error(res, 400, 40002, 'invalid parameter: action should be \'approve\' or \'reject\'');
        return;
    }

    const qstr = "UPDATE user_profile " +
        "SET approval_status=\'" + action + "\' " +
        ",approved_by=\'" + userId + "\' " +
        ",approved_dt=now() " +
        "WHERE user_id = \'" + memberId + "\'";

    const approved_content = '<span style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#000000;">การลงทะเบียนได้รับการอนุมัติแล้ว<br>\
    สามารถเข้าใช้งานได้ทันที<br><br>\
    ขอแสดงความนับถือ<br>\
    ทีม G-Survey<br></span>';

    const rejected_content = '<span style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#000000;">การลงทะเบียนไม่ได้รับการอนุมัติ<br>\
    สาเหตุ: ' + desc +
        '<br><br>\
    ขอแสดงความนับถือ<br>\
    ทีม G-Survey<br></span>';

    return validateAdmin(userId)
        .then(conn => {
            return mysqlHelper.query(conn, qstr)
                .then(result => {
                    if (result !== undefined && result.affectedRows == 1) {
                        conn.destroy();
                        http.success(res);
                        return Promise.resolve(action);
                    } else {
                        conn.destroy();
                        return Promise.reject({
                            httpCode: 404,
                            errorCode: 40401,
                            desc: "not found an member"
                        });
                    }
                })
                .then(action => {

                    if (action === "approve") {
                        let data = {
                            from: "noreply.gsurvey@dga.or.th",
                            to: email,
                            subject: "การลงทะเบียนได้รับการอนุมัติแล้ว",
                            html: approved_content
                        }
                        return mailHeler.sendMail(data)
                            .then(info => {
                                logger.debug("send approved mail to " + email);
                            });

                    } else if (action === "reject") {
                        let data = {
                            from: "noreply.gsurvey@dga.or.th",
                            to: email,
                            subject: "การลงทะเบียนไม่ได้รับการอนุมัติ",
                            html: rejected_content
                        }
                        return mailHeler.sendMail(data)
                            .then(info => {
                                logger.debug("send rejected mail to " + email);
                            });
                    }
                })
                .catch(err => {
                    return Promise.reject({
                        httpCode: 500,
                        errorCode: 50002,
                        desc: err
                    });
                });
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('approve member: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'approve member: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('approve member: ' + err));
                logger.error('approve member: ' + err);
            }
        });

}

function setSuspension(req, res) {
    let userId = req.signedCookies['userid'];;

    if (userId === undefined || userId === "") {
        http.error(res, 401, 40100, 'unauthorized user');
        return;
    }

    if (req.body.userid === undefined || req.body.userid === "") {
        http.error(res, 404, 40400, 'not found userid');
        return;
    }

    if (req.body.email === undefined || req.body.email === "") {
        http.error(res, 404, 40400, 'not found email');
        return;
    }

    if (req.body.action === undefined || req.body.action === "") {
        http.error(res, 404, 40400, 'not found action');
        return;
    }

    let desc = "ไม่ระบุ";

    if (!(req.body.desc === undefined || req.body.desc === "")) {
        desc = req.body.desc;
    }

    let memberId = req.body.userid;
    let action = req.body.action;
    let email = req.body.email;

    if (!(action !== "enable" || action !== "disable")) {
        http.error(res, 400, 40002, 'invalid parameter: action should be \'enable\' or \'disable\'');
        return;
    }

    const qstr = "UPDATE user_profile " +
        "SET suspended_flag=\'" + ((action === "enable") ? 0 : 1) + "\' " +
        "WHERE user_id = \'" + memberId + "\'";

    const approved_content = '<span style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#000000;">บัญชีผู้ใช้เปิดใช้งานแล้ว<br>\
    สามารถเข้าใช้งานได้ทันที<br><br>\
    ขอแสดงความนับถือ<br>\
    ทีม G-Survey<br></span>';

    const rejected_content = '<span style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#000000;">บัญชีผู้ใช้งานถูกระงับชั่วคราว<br>\
    สาเหตุ: ' + desc +
        '<br><br>\
    ขอแสดงความนับถือ<br>\
    ทีม G-Survey<br></span>';

    return validateAdmin(userId)
        .then(conn => {
            return mysqlHelper.query(conn, qstr)
                .then(result => {
                    if (result !== undefined && result.affectedRows == 1) {
                        conn.destroy();
                        http.success(res);
                        return Promise.resolve(action);
                    } else {
                        conn.destroy();
                        return Promise.reject({
                            httpCode: 404,
                            errorCode: 40401,
                            desc: "not found an member"
                        });
                    }
                })
                .then(action => {

                    if (action === "enable") {
                        let data = {
                            from: "noreply.gsurvey@dga.or.th",
                            to: email,
                            subject: "บัญชีผู้ใช้เปิดใช้งานแล้ว",
                            html: approved_content
                        }
                        return mailHeler.sendMail(data)
                            .then(info => {
                                logger.debug("send enable mail to " + email);
                            });

                    } else if (action === "disable") {
                        let data = {
                            from: "noreply.gsurvey@dga.or.th",
                            to: email,
                            subject: "บัญชีผู้ใช้งานถูกระงับชั่วคราว",
                            html: rejected_content
                        }
                        return mailHeler.sendMail(data)
                            .then(info => {
                                logger.debug("send disable mail to " + email);
                            });
                    }
                })
                .catch(err => {
                    return Promise.reject({
                        httpCode: 500,
                        errorCode: 50002,
                        desc: err
                    });
                });
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('suspension member: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'suspension member: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('suspension member: ' + err));
                logger.error('suspension member: ' + err);
            }
        });
}

function deleteMember(req, res) {
    let userId = req.signedCookies['userid'];;

    if (userId === undefined || userId === "") {
        http.error(res, 401, 40100, 'unauthorized user');
        return;
    }

    if (req.params.id === undefined || req.params.id === "") {
        http.error(res, 404, 40400, 'not found userid');
        return;
    }

    let memberId = req.params.id;
    const qstr = "UPDATE user_profile " +
        "SET delete_flag=1 " +
        "WHERE user_id = \'" + memberId + "\' && delete_flag=0";

    return validateAdmin(userId)
        .then(conn => {
            return mysqlHelper.query(conn, qstr)
                .then(result => {
                    if (result !== undefined && result.affectedRows == 1) {
                        conn.destroy();
                        http.success(res)
                    } else {
                        return Promise.reject({
                            httpCode: 404,
                            errorCode: 40402,
                            desc: "cannot delete member due to already deleted or does not exist"
                        });
                    }
                })
        })
        .then(() => {
            logger.debug("delete member success");
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('delete member: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'delete member: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('delete member: ' + err));
                logger.error('delete member: ' + err);
            }
        });
}

module.exports = {
    getMembers,
    setApproval,
    setSuspension,
    deleteMember,
};