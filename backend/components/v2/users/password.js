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

const {
    logger
} = require('../../../commons/logger');
const mail = require('../../helpers/mail');
const http = require('../../../commons/http');
const redis = require('../../helpers/redis');
const appConf = require('../../../config/production.conf');
const mysql = require('../../helpers/mysql');
const hashPWD = require('password-hash');
const {
    EmailTemplate
} = require('../email-templates/form');

function randomString(length, custom_characters) {
    let result = '';
    const characters = custom_characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getOTP() {
    return randomString(16);
}

function isUserExist(username) {
    return mysql.getConnection()
        .then(conn => {
            let qtr = 'SELECT username FROM users WHERE username =\'' + username + '\'';
            return mysql.query(conn, qtr)
                .then(result => {
                    conn.end();
                    console.log(result);
                    if (result.length == 0) {
                        return Promise.reject({
                            httpCode: 404,
                            errorCode: 40400,
                            desc: 'not found ' + username
                        });
                    }
                })
                .catch(err => {
                    if (err.httpCode !== undefined)
                        return Promise.reject(err);
                    else
                        return Promise.reject({
                            httpCode: 500,
                            errorCode: 50002,
                            desc: err
                        });
                });
        });
}

function sendOTP(req, res) {
    let return_url;
    //validate input
    if (req.body.email === undefined || req.body.email === "") {
        http.error(res, 400, 40000, "Not found email");
        return;
    }

    if (req.body.ref_code === undefined || req.body.ref_code === "") {
        http.error(res, 400, 40001, "Not found ref_code");
        return;
    }

    if (req.body.return_url === undefined || req.body.return_url === "") {
        http.error(res, 400, 40001, "Not found return_url");
        return;
    }

    if (req.body.return_url[0] == "h") {
        return_url = req.body.return_url;
    } else {
        if (req.headers.origin === undefined || req.headers.origin === "") {
            http.error(res, 400, 40001, "Not found origin header");
            return;
        } else {
            return_url = req.headers.origin + req.body.return_url;
        }
    }


    //generate OTP
    const otp = getOTP();

    let url = return_url + '?email=' + req.body.email + '&ref_code=' + req.body.ref_code + '&otp=' + otp;
    let body = `<p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">DGA ได้รับคำร้องขอการ reset password แล้ว (เลขอ้างอิง: <strong>${req.body.ref_code}</strong>)</p>
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ลิงค์นี้จะนี้จะมีเวลา 5 นาที</p>
     <a href="${url}" rel="noopener noreferrer" data-auth="NotApplicable" style="border-radius:3px; border-background:#e91e63; background:rgb(233, 30, 99); color:#fff; display:block; font-size:16px; line-height:1.25em; margin:24px auto 24px; padding:10px 18px; text-decoration:none; width:386px; text-align:center">กดเพื่อกรอกรหัสผ่านใหม่</a>
    <br/>
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">
    <strong>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***</strong></p>
    <br/>
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ขอแสดงความนับถือ</p>
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ทีม G-Survey</p>`;
    const email = new EmailTemplate(body, req.protocol+'://'+req.headers.host+'/static/images/logo.png');
    const content = email.getContent();

    isUserExist(req.body.email)
        .then(() => {
            return redis.getRedisConnection()
                .then(rediscli => {
                    const key = req.body.email + "::" + req.body.ref_code; //email:ref_code
                    const value = otp;
                    const timeout = appConf.OTPExpiredTime;
                    redis.redisSet(rediscli, key, value, )
                        .then(reply => {
                            logger.debug("redis write key=" + key + ", value=" + value + ", timeout=" + timeout + "s successfully")
                        })
                })
                .catch(err => {
                    return Promise.reject({
                        httpCode: 500,
                        errorCode: 50002,
                        desc: 'redis err: ' + err
                    });
                });
        })
        .then(() => {
            return mail.sendMail({
                    from: "noreply.gsurvey@dga.or.th",
                    to: req.body.email,
                    subject: "reset password (เลขอ้างอิง: " + req.body.ref_code + ")",
                    html: content
                })
                .then(info => {
                    logger.debug("sent mail to " + req.body.email + " successfully");
                    http.success(res);
                });
        })
        .catch(err => {
            console.log(err);
            if (err.httpCode !== undefined) {
                http.error(res, err.httpCode, err.errorCode, 'get OPT: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('get OTP: ' + err));
            }
            logger.error('get OTP: ' + err);
        });
}

function resetPassword(req, res) {
    //validate input

    if (req.body.email === undefined || req.body.email === "") {
        http.error(res, 400, 40001, "Not found email");
        return;
    }

    if (req.body.ref_code === undefined || req.body.ref_code === "") {
        http.error(res, 400, 40001, "Not found ref_code");
        return;
    }

    if (req.body.ref_code === undefined || req.body.otp === "") {
        http.error(res, 400, 40001, "Not found ref_code");
        return;
    }

    let otp = req.body.otp;
    let username = req.body.email;
    let refCode = req.body.ref_code;
    let password = req.body.password;
    let returnURL = req.body.return_url;
    let hashedPassword = hashPWD.generate(password);

    //reset password
    redis.getRedisConnection()
        .then(rediscli => {
            const key = username + "::" + refCode; //email:ref_code
            return redis.redisGet(rediscli, key)
                .then(value => {
                    console.log("checking OPT: " + otp + " == " + value);
                    if (otp !== value)
                        return Promise.reject({
                            httpCode: 400,
                            errorCode: 40001,
                            desc: "invalid otp"
                        });
                });
        })
        .then(() => {
            return mysql.getConnection()
                .then(conn => {
                    let qstr = "UPDATE users SET password=\'" + hashedPassword + "\' WHERE username=\'" + username + "\'";
                    return mysql.query(conn, qstr)
                        .then(result => {
                            if (result.affectedRows !== 1) {
                                return Promise.reject({
                                    httpCode: 500,
                                    errorCode: 50002,
                                    desc: "Cannot update password"
                                });
                            }
                        });
                })
        })
        .then(() => {
            return redis.getRedisConnection()
                .then(rediscli => {
                    let key = username + "::" + refCode;
                    return redis.redisDel(rediscli, key)
                        .then(reply => {
                            console.log(reply);
                            logger.debug("OTP key: " + reply + " removed");
                            if (returnURL !== undefined)
                                res.redirect(301, returnURL);
                            else
                                http.success(res);
                        });
                });
        })
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('reset password: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'reset password: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('get OTP: ' + err));
                logger.error('reset password: ' + err);
            }

        });
}

function changePassword(req, res) {
    //validate input
    let userId = req.ctx.userId;

    if (req.body.oldpass === undefined || req.body.oldpass === "") {
        http.error(res, 400, 40001, "Not found oldpass");
        return;
    }

    if (req.body.newpass === undefined || req.body.newpass === "") {
        http.error(res, 400, 40001, "Not found newpass");
        return;
    }
    let oldpass = req.body.oldpass;
    let newpass = req.body.newpass;
    let hashedPassword = hashPWD.generate(newpass);

    //change new password
    mysql.getConnection()
        .then(conn => {
            let qstr = "SELECT password FROM users WHERE user_id=\'" + userId + "\'";
            return mysql.query(conn, qstr)
                .then(result => {
                    let password = result[0].password;
                    if (hashPWD.verify(oldpass, password)) {
                        return Promise.resolve(conn);
                    } else {
                        return Promise.reject({
                            httpCode: 400,
                            errorCode: 40001,
                            desc: "old password dose not match"
                        });
                    }
                });
        })
        .then(conn => {
            let qstr = "UPDATE users SET password=\'" + hashedPassword + "\' WHERE user_id=\'" + userId + "\'";
            return mysql.query(conn, qstr)
                .then(result => {
                    if (result.affectedRows !== 1) {
                        return Promise.reject({
                            httpCode: 500,
                            errorCode: 50002,
                            desc: "Cannot update password"
                        });
                    }
                });
        })
        .then(() => {
            http.success(res);
            logger.debug("password change complete");
        })
        //send email
        //.then(()=>{})
        .catch(err => {
            if (err.httpCode !== undefined) {
                logger.error('change password: ' + err.desc);
                http.error(res, err.httpCode, err.errorCode, 'change password: ' + err.desc);
            } else {
                http.error(res, 500, 50001, ('get OTP: ' + err));
                logger.error('change password: ' + err);
            }

        });

}

module.exports = {
    sendOTP,
    resetPassword,
    changePassword,
}