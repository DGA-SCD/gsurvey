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
const express = require('express');
const {
    logger
} = require('../../../commons/logger');
const http = require('../..//../commons/http');
const appConf = require('../../../config/production.conf');
const router = express.Router();
const mongo = require('../../helpers/mongodb');
const mail = require('../../helpers/mail');
const pwd = require('password-hash');
const mysql = require('../../helpers/mysql');

function register(req, res) {
    //validate user info

    if (req.body.firstname === undefined) {
        http.error(res, 400, 40001, "not found firstname");
        return;
    }

    if (req.body.lastname === undefined) {
        http.error(res, 400, 40001, "not found lastname");
        return;
    }

    if (req.body.mobile === undefined) {
        http.error(res, 400, 40001, "not found mobile");
        return;
    }

    if (req.body.email === undefined) {
        http.error(res, 400, 40001, "not found email");
        return;
    }

    if (req.body.password === undefined) {
        http.error(res, 400, 40001, "not found password");
        return;
    }

    if (req.body.min_id === undefined) {
        http.error(res, 400, 40001, "not found min_id");
        return;
    }

    if (req.body.dep_id === undefined) {
        http.error(res, 400, 40001, "not found dep_id");
        return;
    }

    if (req.body.org_id === undefined) {
        http.error(res, 400, 40001, "not found org_id");
        return;
    }

    var username = req.body.email;
    var password = pwd.generate(req.body.password);
    var role = 0;
    var user_id;

    /* prepare statement */
    var qstr_usr_insert = "INSERT INTO users(`username`, `password`, `role_id`) value('" + username + "','" + password + "','" + role + "')";


    /* insert to user */
    /* insert to user_profile */


    mysql.getConnection()
        .then(conn => {
            return mysql.query(conn, qstr_usr_insert)
                .then(result => {
                    return Promise.resolve(conn);
                });
        })
        .then((conn) => {
            return mysql.query(conn, "SELECT user_id FROM users where username= '" + username + "' and password='" + password + "'")
                .then(result => {
                    console.log(result);
                    return Promise.resolve({
                        conn: conn,
                        user_id: result[0].user_id
                    });
                });
        })
        .then(obj => {
            var qstr_prf_insert = "INSERT INTO user_profile(`user_id`, `dep_id`, `ministry_code`," +
                "`org_code`, `prefix_id`, `firstname`, `lastname`, `email`, `mobile`, `delete_flag`, `approval_status`, `position`, `office_phone`,`ext`) " +
                " value(" + obj.user_id + "," +
                req.body.dep_id + ",'" +
                req.body.min_id + "','" +
                req.body.org_id + "'," +
                "1,'" + //prefix id
                req.body.firstname + "','" +
                req.body.lastname + "','" +
                req.body.email + "','" +
                req.body.mobile + "'," +
                "0," + //delete flag
                "'waiting','','','')";
            return mysql.query(obj.conn, qstr_prf_insert)
                .then(result => {
                    console.log(result);
                });
        })
        .then(() => {
            return mail.sendMail({
                from: 'noreply.gsurvey@dga.or.th',
                to: req.body.email,
                subject: 'ยืนยันการสมัครใช้งานระบบ G-Survey',
                html: 'ทาง DGA ได้รับคำขอการลงทะเบียนของท่านเรียบร้อยแล้ว\n\n' +
                    'รอการยืนยันจากผู้ดูแลระบบอีกครั้ง สำหรับการเข้าใช้งานระบบ G-Survey\n\n' +
                    'ขอแสดงความนับถือ\n' +
                    'ทีม G-Survey',
            }).then(info => {
                logger.debug("sent mail to " + req.body.email + " successfully");
            });
        }).then(() => {
            http.success(res);
        }).catch(err => {
            logger.debug(err);
            if (err.code !== undefined && err.code === "ER_DUP_ENTRY") {
                http.error(res, 403, 40300, req.body.email + ' is already exist');
            } else {
                http.error(res, 500, 50002, err);
            }
        });
}

module.exports = {
    register
};