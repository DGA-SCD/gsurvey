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
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const base64url = require('base64url')
const mysql = require('mysql');
const promise = require('promise');
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const appConf = require('../../config/production.conf');
const redis = require("redis");
const logger = winston.logger;
const router = express.Router();


// Login 
// require username and password
function login(req, res) {
    var ctx = req.body;
    const userid = ctx.userId;
    const password = ctx.password;
    
    logger.debug('user: ' + userid);
    logger.debug('password: ' + password);

    var userName = userid;
    
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });
    
    conn.connect(function(err) {
        
        logger.debug("Trying...");

        if ( err ) {
            logger.error("Cannot connect to mariadb");
            http.error(res, 500, 50000, "Cannot connect to mariadb");
            conn.end();
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
                    http.error(res, 404, 404000, "Not found user or password");
                    conn.end();
                    return; 
                } else {
                    logger.debug( "result " + JSON.stringify(result));
                    var token = base64url(crypto.randomBytes(48));
                    const redisCli = redis.createClient({
                        port      : appConf.REDIS_port,               // replace with your port
                        host      : appConf.REDIS_host,        // replace with your hostanme or IP address
                    });
                    redisCli.on("error", function (err) {
                        logger.error("redis: " + err);
                    });
                    
                    redisCli.set(userName, token, 'EX', 3600, function(err, reply){
                        if( err ) {
                            logger.error("redis: " + err);
                            redisCli.end(true);
                        } else {
                            logger.debug("redis: " + reply);
                            var userDetails = result[0];
                            if ( result[0] != null ) {

                                let options = {
                                    maxAge: 1000 * 60 * 15,         // would expire after 15 minutes
                                    httpOnly: true,                 // The cookie only accessible by the web server
                                    signed: appConf.cookies.signed  // Indicates if the cookie should be signed
                                }    
                                
                                res.cookie('userid', userDetails.UserID, options);
                                res.cookie('token', token, options);

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
                                    level: userDetails.Level,
                                    role: userDetails.Role,
                                    token: token
                                })
                                redisCli.end(true);
                                conn.end();
                            } else {
                                logger.error("invalid user or password");
                                http.error(res, 401, 401000, "invalid user or password");
                                redisCli.end(true);
                                conn.end();
                            }
                        }
                    });
                }
            });
        }
    });
}

function getConnection(){
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });
    return new promise(function(resolve, reject){
        conn.connect(function(err) {
            if ( err ) {
                reject( err );
            } else {
                resolve( conn );
            }
        })
    });
}

function getUserDetails(conn, userName, password )
{
    const qstr = "SELECT * FROM user_details \
    INNER JOIN passwords on user_details.UserId = passwords.Username \
    WHERE passwords.username = '" + userName + "' and passwords.password = '"+ password +"'";

    return new promise(function(resolve, reject) {
        conn.query(qstr, function(err, result, fields){
            if ( err ) {
                reject( err );
            }
            else {
                conn.end();
                resolve( result );
            }
        });
    });
}

module.exports = {
    login,
    getConnection,
    getUserDetails
}