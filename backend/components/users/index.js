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
const redis = require("redis"),redisCli = redis.createClient();;
const mysql = require('mysql');
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const router = express.Router();

router.use(function(req, res, next){
    logger.info('calling users api');
    logger.debug('request body: ' + JSON.stringify(req.body));
    next();
});

router.post('/login',function(req, res) {
    var ctx = req.body;
    const userid = ctx.userId;
    const password = ctx.password;
    
    logger.debug('user: ' + userid);
    logger.debug('password: ' + password);

    var userName = userid.substring(0,2) + '-' +  userid.substring(2);
    
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    conn.connect(function(err) {
        if ( err ) {
            logger.error("Cannot connect to database");
            http.error(res, 500, 50000, "Cannot connect to database");
            return;
        }else{
            logger.debug("Database connected!");
            logger.debug("Search user name: " + userName);

            const qstr = "SELECT * FROM user_details \
            INNER JOIN passwords on user_details.UserId = passwords.Username \
            WHERE passwords.username = '" + userName + "' and passwords.password = '"+ password +"'";

            conn.query(qstr, function(err, result, fields){
                if ( err ) {
                    logger.error( err );
                    http.error(res, 404, 404000, "not found user or password");
                    return; 
                } else {
                    logger.debug( "result " + JSON.stringify(result));
                    var token = base64url(crypto.randomBytes(48));

                    redisCli.on("error", function (err) {
                        logger.error("redis: " + err);
                    });
                    
                    redisCli.set(userName, token, 'EX', 3600, function(err, reply){
                        if( err ) {
                            logger.error("redis: " + err);
                        } else {
                            logger.debug("redis: " + reply);
                            var userDetails = result[0];
                            if ( result[0] != null ) {
                                http.success(res, { 
                                    id: userDetails.UserID,
                                    name: userDetails.Name,
                                    surname: userDetails.Surname,
                                    nameEN: userDetails.NameEn,
                                    surnameEN: userDetails.SurnameEn,
                                    nickName: userDetails.NickName,
                                    tel: userDetails.Telephone,
                                    email: userDetails.Email,
                                    position: userDetails.Position,
                                    department: userDetails.Department,
                                    devision: userDetails.Segment,
                                    token: token
                                })
                            } else {
                                logger.error("invalid user or password");
                                http.error(res, 401, 401000, "invalid user or password");
                            }
                        }
                    });
                    conn.end();
                }
            });
        }
    });
});

module.exports = router;