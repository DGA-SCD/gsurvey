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

const express = require('express');
const crypto = require('crypto');
const base64url = require('base64url')
const mysql = require('mysql');
const helperMySQL = require('../../helpers/mysql');
const winston = require('../../../commons/logger');
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
const redis = require("redis");
const logger = winston.logger;
const router = express.Router();
const promise = require('promise');
const MongoClient = require('mongodb').MongoClient;

// Get User profile 
function getProfile(req, res) {

    var userName = req.signedCookies['username']; //req.USERNAME;
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    conn.connect(function (err) {

        logger.debug("Trying...");

        if (err) {
            logger.error("Cannot connect to mariadb");
            http.error(res, 500, 50000, "Cannot connect to mariadb");
            conn.end();
            return;
        } else {
            logger.debug("Database connected!");
            logger.debug("Search user name: " + userName);

            const qstr = "SELECT * " +
                "FROM users " +
                "JOIN user_profile on users.user_id = user_profile.user_id " +
                "JOIN department on department.dep_code = user_profile.dep_code " +
                "JOIN ministry on ministry.ministry_code = user_profile.ministry_code " +
                "JOIN roles on roles.role_id = users.role_id " +
                "WHERE users.username = '" + userName + "' ";
            logger.debug("user query: " + qstr);
            conn.query(qstr, function (err, result, fields) {
                if (err) {
                    logger.error(err);
                    http.error(res, 404, 404000, "Not found user or password");
                    conn.end();
                    return;
                } else {
                    logger.debug("result " + JSON.stringify(result));
                    var userDetails = result[0];
                    if (result[0] != null) {
                        http.success(res, {
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
                        })
                        conn.end();
                    } else {
                        logger.error("invalid user or password");
                        http.error(res, 401, 401000, "invalid user or password");
                        conn.end();
                    }
                }
            });
        }
    });
}

// getAlluser
function getAllUser(conn) {

    const qstr = "SELECT \
        t.*,\
        u2.Name  as FName,\
        u2.Surname as FSurname, \
        b.Vehicle, \
        b.Room, \
        b.Join, \
        ss.IsAnswer, \
        b.Remark \
    FROM ( \
        SELECT   \
            u.userID, \
            u.Name, \
            u.Surname, \
            u.Department, \
            u.Segment, \
            r.FriendID FROM user_details as u \
    LEFT JOIN roommates as r \
    ON u.userId = r.UserID \
    ) as t \
    LEFT JOIN user_details as u2 on t.FriendID = u2.UserID \
    LEFT JOIN booking as b on b.userId = t.userId \
    LEFT JOIN user_stats as ss on ss.userId = t.userId";

    return new promise(function (resolve, reject) {
        conn.query(qstr, function (err, result, fields) {
            if (err) {
                logger.error("query failed: " + err);
                reject(err);
            } else {
                conn.end();
                resolve(result);
            }
        });
    });
}

module.exports = {
    getProfile
};