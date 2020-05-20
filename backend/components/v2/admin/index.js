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
const cookieParser = require('cookie-parser');
const winston = require('../../../commons/logger');
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
const promise = require('promise');
const MongoClient = require('mongodb').MongoClient
const redis = require("redis");
const logger = winston.logger;
const router = express.Router();
const mongo = require('../../helpers/mongodb');
const users = require('./user');
const uuidv4 = require('uuid/v4');
const auth = require('../../helpers/auth');
const members = require('./members');
const {saveSurvey,
    createEmptySurvey,
    getAllSurveysByOwnerId,
    getSurveyById,
    renameSurvey,
    deleteSurvey,
    getAllResultsBySurveyId,
    getResultById,
    saveResult,
    viewPassword,
    duplicateSurvey} = require('./survey');

router.use(function (req, res, next) {
    logger.info('calling users api ' + req.path);
    logger.debug('request body: ' + JSON.stringify(req.body));
    next();
});

router.use(cookieParser(appConf.cookies.secreteKey, {
    maxAge: 1000 * 60 * 15, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    signed: appConf.cookies.signed // Indicates if the cookie should be signed
}));

router.use(function (req, res, next) {

    console.log(req.headers);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || appConf.access_control_allow.origin);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', appConf.access_control_allow.methods);

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', appConf.access_control_allow.headers);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', appConf.access_control_allow.credentials);

    var userName, tokenId;

    if (req.signedCookies['username'] !== undefined && req.signedCookies['token'] !== undefined) {
        userName = req.signedCookies['username'];
        tokenId = req.signedCookies['token'];
        logger.info("Found token in cookies");
    } else if (req.headers['username'] !== undefined && req.headers['token'] !== undefined) {
        logger.info("Not found token in cookies. Using the token on header, instead");
        userName = req.headers['username'];
        tokenId = req.headers['token'];
    } else {
        logger.error("Not found token");
        http.error(res, 401, 401000, "authorization required");
        return;
    }

    logger.debug('read cookies user name: ' + userName + ' token: ' + tokenId);

    auth.verifyToken(userName, tokenId, function (err) {
        if (err) {
            http.error(res, 401, 401000, "Invalid token");
        } else {
            req.USERNAME = userName;
            next();
        }
    })
});

// Survey Management Services
// /v2/survey/:userID
router.get('/surveys/:surveyId', getSurveyById);
router.get('/surveys/owner/:ownerid', getAllSurveysByOwnerId);
router.post('/surveys', saveSurvey);
router.post('/surveys/create', createEmptySurvey);
router.post('/surveys/rename', renameSurvey);
router.delete('/surveys', deleteSurvey);

// /v2/results
router.get('/results/surveyid/:surveyId', getAllResultsBySurveyId); /* requires Question ID */
router.get('/results/:resultId', getResultById)
router.post('/results', saveResult);

// /v2/users[deprecated]
router.get('/users/profile', users.getProfile);

// /api/v2/admin/password/change
router.post('/password/change', users.changePassord);


// /api/v2/admin/members
router.get("/members", members.getMembers);

// /api/v2/admin/members/approval
router.post("/members/approval", members.setApproval);

// /api/v2/admin/members/suspension
router.post("/members/suspension", members.setSuspension);

// /api/v2/admin/members/{:id}
router.delete("/members/:id", members.deleteMember);

// /api/v2/admin/profile
router.get('/profile', users.getProfile);

// /api/v2/admin/profile
router.post('/profile', users.updateProfile);

// /api/v2/admin/survey/password
router.get('/survey/password', viewPassword);

// /api/v2/admin/survey/duplicate?sid=1&v=1
router.post('/survey/duplicate', duplicateSurvey);



module.exports = router;