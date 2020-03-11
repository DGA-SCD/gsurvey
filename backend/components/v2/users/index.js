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
const http = require('../..//../commons/http');
const appConf = require('../../../config/production.conf');
const redis = require("redis");
const logger = winston.logger;
const router = express.Router();
const mongo = require('../../helpers/mongodb');
const uuidv4 = require('uuid/v4');

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
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || appConf.access_control_allow.origin);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', appConf.access_control_allow.methods);

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', appConf.access_control_allow.headers);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', appConf.access_control_allow.credentials);

    next();
});

function getSurveyById(req, res) {

    if (req.query.sid === undefined) {
        http.error(res, 400, 40000, "Not found surveyid");
        return;
    }

    if (req.query.uid === undefined ) {
        http.error(res, 400, 40000, "Not found userid");
        return;
    }

    if (req.query.v === undefined ) {
        http.error(res, 400, 40000, "Not found version");
        return;
    }

    var filters = {
        surveyid: req.query.sid,
        version: req.query.v,
        userid: req.query.uid
    };

    mongo.find(filters, appConf.surveyCollections.survey).then(results => {
            http.success(res, results[0]);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongodb error: " + err);
            return false;
        });
};

function saveResult(req, res) {

    var body = req.body;
    var resultid = 'undefined';

    if (body.surveyid === undefined) {
        http.error(res, 400, 40000, "Not found surveyid");
        return;
    }

    if (body.userid === undefined ) {
        http.error(res, 400, 40000, "Not found userid");
        return;
    }

    if (body.version === undefined ) {
        http.error(res, 400, 40000, "Not found version");
        return;
    }

    if (body.resultid == 'undefined' || body.resultid == null) {
        resultid = uuidv4();
    } else {
        resultid = body.resultid;
    }

    var filters = {
        surveyid: body.surveyid,
        resultid: resultid,
        userid: body.userid,
        version: body.version
    }

    var data = {
        surveyid: body.surveyid,
        resultid: resultid,
        userid: body.userid,
        result: body.result,
        version: body.version
    }

    mongo.insert(filters, data, appConf.surveyCollections.result).then(result => {
            http.success(res, result);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongodb error: " + err);
            return false;
        });
}


// /api/v2/users/surveys
router.get('/surveys', getSurveyById);

// /api/v2/users
router.post('/results', saveResult); /* requires Question ID and Question Owner */


module.exports = router;