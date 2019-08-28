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
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const appConf = require('../../config/production.conf');
const auth = require('../helpers/auth');
const redis = require("redis");
const logger = winston.logger;
const router = express.Router();

router.use(function(req, res, next){
    logger.info('calling users api');
    logger.debug('request body: ' + JSON.stringify(req.body));
    next();
});

router.use(cookieParser(appConf.cookies.secreteKey,
{
    maxAge: 1000 * 60 * 15,         // would expire after 15 minutes
    httpOnly: true,                 // The cookie only accessible by the web server
    signed: appConf.cookies.signed  // Indicates if the cookie should be signed
}));

router.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    var userId, tokenId;

    if ( req.signedCookies['userid'] !== undefined && req.signedCookies['token'] !== undefined ) {
        userId = req.signedCookies['userid'];
        tokenId = req.signedCookies['token'];
        logger.info("Found token in cookies");
    } else if ( req.headers['userid'] !== undefined && req.headers['token'] !== undefined ) {
        logger.info("Not found token in cookies. Using the token on header, instead")
        userId = req.headers['userid'];
        tokenId = req.headers['token'];
    } else {
        logger.error("Not found token");
        http.error(res, 401, 401000, "Invalid token");
        return;
    }

    logger.debug('read cookies userid: ' + userId + ' token: ' + tokenId);
    
    auth.verifyToken( userId, tokenId, function (err) {
        if( err ){
            http.error(res, 401, 401000, "Invalid token");
        }else{
            next();
        }
    })
    
});

router.get('/roommates/:userid', function(req, res){

    var userId = req.params.userid;

    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    conn.connect(function(err) {
        if ( err ) {
            logger.error("Cannot connect to mariadb");
            http.error(res, 500, 50000, "Cannot connect to mariadb");
            conn.end();
            return;
        } else {
            logger.debug("Database connected!");

            const qstr = "SELECT user_details.UserID,\
             user_details.Name, \
             user_details.Surname, \
             user_details.Position, \
             user_details.Department, \
             user_details.Segment \
             FROM user_details \
            INNER JOIN roommates on user_details.UserId = roommates.UserId \
            WHERE roommates.FriendID = " + userId;

            conn.query(qstr, function(err, result, fields) {
                if ( err ) {
                    logger.error( err );
                    http.error(res, 404, 404000, "not found user or password");
                    conn.end();
                    return; 
                } else {
                    var frientLists = [];
                    for ( i = 0 ;i < result.length; i++ ){
                        frientLists.push({
                            userId: result[i].UserID,
                            name: result[i].Name,
                            surname: result[i].Surname,
                            position: result[i].Position,
                            department: result[i].Department,
                            devision: result[i].Segment,
                            displayName: result[i].Name + " " 
                            + result[i].Surname + " / " 
                            + result[i].UserID + " / "
                            + result[i].Segment
                        });
                    }
                    http.success(res, {frientLists});
                    conn.end();
                }
            });
        }
    });
});

// Get list of available friends
router.get('/roommates', function(req, res){
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    conn.connect(function(err) {
        if ( err ) {
            logger.error("Cannot connect to mariadb");
            http.error(res, 500, 50000, "Cannot connect to mariadb");
            conn.end();
            return;
        } else {
            logger.debug("Database connected!");

            const qstr = "SELECT user_details.UserID,\
             user_details.Name, \
             user_details.Surname, \
             user_details.Position, \
             user_details.Department, \
             user_details.Segment \
             FROM user_details \
            INNER JOIN roommates on user_details.UserId = roommates.UserId \
            WHERE roommates.FriendID is null";

            conn.query(qstr, function(err, result, fields) {
                if ( err ) {
                    logger.error( err );
                    http.error(res, 404, 404000, "not found user or password");
                    conn.end();
                } else {
                    var frientLists = [];
                    for ( i = 0 ;i < result.length; i++ ){
                        frientLists.push({
                            userId: result[i].UserID,
                            name: result[i].Name,
                            surname: result[i].Surname,
                            position: result[i].Position,
                            department: result[i].Department,
                            devision: result[i].Segment,
                            displayName: result[i].Name + " " 
                            + result[i].Surname + " / " 
                            + result[i].UserID + " / "
                            + result[i].Segment
                        });
                    }
                    http.success(res, {frientLists});
                    conn.end();
                }
            });
        }
    });
});

// Binding a friend with the same room.
router.post('/roommates/:userid', function(req, res){

    var ctx = req.body;
    var newFriend = ctx.friendId;
    var userId = req.params.userid;

    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    try {
        conn.connect(function(err) {
            if ( err ) {
                logger.error("Cannot connect to mariadb");
                http.error(res, 500, 50000, "Cannot connect to mariadb");
                return;
            } else {
                logger.debug("Database connected!");
                // user and friend should be available.
                var qstr = "SELECT * FROM roommates"
                + " WHERE  (UserID =  " + userId + " AND friendID is null )"
                + " OR (UserId = " + newFriend + " AND friendID is null)";
                
                conn.query(qstr, function(err, result, fields) {
                    if ( err ) {
                        logger.error( err );
                        http.error(res, 500, 50000, err);
                        conn.end();
                    } else {
                       
                        if( result.length == 2 ){ 
                            //The both of you are available
                            qstr = "UPDATE roommates \
                                        SET FriendID = " + newFriend
                                        + " WHERE UserID = " + userId + " and FriendID is null";
                            conn.query(qstr, function(err, result, fields) {
                                if( err ) {
                                    logger.error( err );
                                    http.error(res, 500, 50000, err);
                                    conn.end();
                                } else {
                                    qstr = "UPDATE roommates \
                                        SET FriendID = " + userId
                                        + " WHERE UserID = " + newFriend;
                                    conn.query(qstr, function(err, result, fields) {
                                        if( err ) {
                                            logger.error( err );
                                            http.error(res, 500, 50000, err);
                                            conn.end();
                                        } else {
                                            http.success(res);
                                            conn.end();
                                        }
                                    });
                                }
                            });
                        } else { 
                            //Someone is not available
                            logger.error( "Someone is not available" );
                            http.error(res, 403, 403000, "Someone is not available");
                            conn.end();
                        }
                    }
                });
            }
        });
    } catch( ex ) {
        http.error(res, 500, 50000, ex);
    }

});

// Unbinding a friend
router.delete('/roommates/:userid', function(req, res){

    var userId = req.params.userid;

    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });

    conn.connect(function(err) {
        if ( err ) {
            logger.error("Cannot connect to mariadb");
            http.error(res, 500, 50000, "Cannot connect to mariadb");
            conn.end();
            return;
        } else {
            logger.debug("Database connected!");
            // user and friend should be available.
            var qstr = "SELECT * FROM roommates"
            + " WHERE  (UserID =  " + userId + " AND friendID is not null )";
            
            conn.query(qstr, function(err, result, fields) {
                if ( err ) {
                    logger.error(err);
                    http.error(res, 500, 50000, err);
                    conn.end();
                    return;
                } else {
                    console.log(result);
                    if( result[0] != null && result[0].UserID != 'undefined' && result[0].FriendID != 'undefined' ){ 
                        userId = result[0].UserID;
                        friendId = result[0].FriendID;

                        //The both of you are available
                        qstr = "UPDATE roommates \
                                    SET FriendID = null"
                                    + " WHERE UserID = " + userId;
                        conn.query(qstr, function(err, result, fields) {
                            if( err ) {
                                logger.error(err);
                                http.error(res, 500, 50000, err);
                                conn.end();
                                return;
                            } else {
                                qstr = "UPDATE roommates \
                                    SET FriendID = null"
                                    + " WHERE UserID = " + friendId;
                                conn.query(qstr, function(err, result, fields) {
                                    if( err ) {
                                        logger.error(err);
                                        http.error(res, 500, 50000, err);
                                        conn.end();
                                        return;
                                    } else {
                                        http.success(res);
                                        conn.end();
                                        return;
                                    }
                                });
                            }
                        });
                    } else { 
                        logger.error("Not found an user");
                        http.error(res, 404, 40400, "Not found an user");
                        conn.end();
                        return;
                    }
                }
            });
        }
    });
});

// Login 
// require username and password
router.post('/login', function(req, res) {
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
});

module.exports = router;
