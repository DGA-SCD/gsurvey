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
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

/** Survey Management Services */

function storeToMongodb(res, filters, survey) {
    new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(appConf.SurveyCollections.survey).findOneAndReplace(filters, survey, {
                        upsert: true
                    }, function (err, result) {
                        if (err) {
                            logger.error('Error occurred while inserting: ' + err);
                            http.error(res, 500, 50000, "Error occurred while inserting: " + err);
                            db.close();
                            reject(err);
                        } else {
                            logger.debug('inserted answer record: ' + JSON.stringify(result));
                            http.success(res);
                            db.close();
                            resolve(true);
                        }
                    })
            })
            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                http.error(res, 500, 50000, "Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

function queryFromMongodb(res, filters){
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(appConf.SurveyCollections.survey).find(filters).toArray(function (err, results) {
                        if (err) {
                            logger.error('Error occurred while querying: ' + err);
                            http.error(res, 500, 50000, "Error occurred while querying: " + err);
                            db.close();
                            reject(err);
                        } else {
                            logger.debug('results: ' + JSON.stringify(results));
                            http.success(res, results);
                            db.close();
                            resolve(true);
                        }
                    })
            })
            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                http.error(res, 500, 50000, "Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

function postSurvey(req, res) {

    console.log(req.body)

    var body = req.body

    var survey = {
        userid: body.userid,
        name: body.name,
        id: body.id,
        version: body.version,
        pages: body.pages
    }

    var filters = {
        userid: body.userid,
        name: body.name,
        id: body.id,
        version: body.version
    };

    return storeToMongodb(res, filters, survey);
}

function createEmptySurvey(req, res) {
    console.log(req.body)

    var body = req.body

    var survey = {
        userid: body.userid,
        name: body.name,
        id: body.id,
        version: body.version
    }

    var filters = {
        userid: body.userid,
        name: body.name,
        id: body.id,
        version: body.version
    };

    return storeToMongodb(res, filters, survey);
}

function getAllSurveysByOwnerId(req, res) {
    if (req.params.ownerid == 'undefined') {
        http.error(res, 400, "Not found owerid");
    }

    var filters = {
        userid: req.params.ownerid
    };

    return queryFromMongodb(res, filters);

}

function getSurveyById(req, res) {

    if( req.params.surveyId == 'undefined' ) {
        http.error(res, 400, "Not found owerid");
    }

    var filters = {
        id: req.params.surveyId
    };
    
    return queryFromMongodb(res, filters);
};

/** Answer Management Services */
function getAllResultsBySurveyId(req, res) {
    http.success(res, "OK");
}


// Survey Management Services
// /v2/survey/:userID
router.get('/survey/:surveyId', getSurveyById);
router.get('/survey/owner/:ownerid', getAllSurveysByOwnerId);
router.post('/survey', postSurvey);
router.post('/survey/create', createEmptySurvey)

// /v2/results
router.get('/results', getAllResultsBySurveyId); /* requires Question ID */

module.exports = router;