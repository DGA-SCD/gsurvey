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
// booking schema
const schema = require('./allBookingSchema');
const auth = require('../helpers/auth');
const redis = require("redis");
const promise = require("promise");
const user = require("./user");
const logger = winston.logger;
const router = express.Router();

var USERID;

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
            USERID = userId;
            req.USERID = userId;
            next();
        }
    })
    
});

// Get User profile 
router.get('/profile', user.getProfile);

// Get roomate by userid
router.get('/roommates/:userid', user.getRoommatesByUserId);

// Get list of available friends
router.get('/roommates', user.getRoommates );

// Binding a friend with the same room.
router.post('/roommates/:userid', user.bindRoommate);

// Unbinding a friend
router.delete('/roommates/:userid', user.unbindRoommate);

 // get all booking
router.get('/allbooking', user.getAllBooking);
module.exports = router;
