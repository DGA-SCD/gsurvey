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

/** Survey Management Services */

function saveSurvey(req, res) {

    console.log(req.body)

    var body = req.body

    var searchFilters = {
        userid: body.userid,
        surveyid: body.surveyid,
        version: body.version,
    };

    let resultProvmises = mongo.find(searchFilters, appConf.surveyCollections.survey, {});

    var survey = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version,
        pages: body.pages,
        created_at: new Date(),
        modified_at: new Date(),
    }

    var filters = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version
    };

    resultProvmises.then(results => {
            return Promise.resolve(results);
        })
        .catch(err => {
            mongo.insert(filters, survey, appConf.surveyCollections.survey).then(result => {
                    http.success(res, result);
                    return true;
                })
                .catch(err => {
                    http.error(res, 500, 50000, "mongo error: " + err);
                    return false;
                });
        })
        .then(results => {
            if (results[0] !== undefined && results[0].created_at !== undefined) {
                console.log("created at : " + results[0].created_at);
                survey.created_at = results[0].created_at;
            }
            mongo.insert(filters, survey, appConf.surveyCollections.survey).then(result => {
                    http.success(res, result);
                    return true;
                })
                .catch(err => {
                    http.error(res, 500, 50000, "mongo error: " + err);
                    return false;
                });
        })


}

function createEmptySurvey(req, res) {
    console.log(req.body)

    var body = req.body

    if (body.userid === undefined) {
        http.error(res, 400, 40000, 'require "userid"');
        return;
    }

    if (body.name === undefined) {
        http.error(res, 400, 40000, 'require "name"');
        return;
    }

    if (body.surveyid === undefined) {
        http.error(res, 400, 40000, 'require "surveyid"');
        return;
    }

    if (body.version === undefined) {
        http.error(res, 400, 40000, 'require "version"');
        return;
    }


    var survey = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version,
        created_at: new Date(),
        modified_at: new Date(),
    }

    var filters = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version
    };

    mongo.insert(filters, survey, appConf.surveyCollections.survey).then(result => {
            http.success(res, result);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
}

function getAllSurveysByOwnerId(req, res) {
    if (req.params.ownerid == 'undefined') {
        http.error(res, 400, 40000, "Not found owerid");
        return false;
    }

    var filters = {
        userid: req.params.ownerid
    };

    var sort = {
        created_at: -1
    };

    mongo.find(filters, appConf.surveyCollections.survey, sort).then(results => {
            http.success(res, results);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });

}

function getSurveyById(req, res) {

    var userid = 'undefined';
    var version = '1';

    if (req.query.uid === undefined) {
        http.error(res, 400, 40000, "Not found userid");
        return;
    } else {
        userid = req.query.uid + "";
    }

    if (req.query.v !== undefined) {
        version = req.query.v + "";
    }

    if (req.params.surveyId === undefined) {
        http.error(res, 400, 40000, "Not found owerid");
        return;
    }

    var filters = {
        surveyid: req.params.surveyId,
        version: version,
        userid: userid,
    };

    mongo.find(filters, appConf.surveyCollections.survey).then(results => {
            http.success(res, results[0]);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
};

function renameSurvey(req, res) {

    var filters = {
        surveyid: req.body.surveyid,
        userid: req.body.userid,
        version: req.body.version
    };


    var data = {
        $set: {
            name: req.body.name,
            modified_at: new Date(),
        }
    };

    mongo.update(filters, data, appConf.surveyCollections.survey).then(results => {
            http.success(res, results);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
}

function deleteSurvey(req, res) {
    var filters = {
        userid: req.body.userid,
        surveyid: req.body.surveyid,
        version: req.body.version
    };

    mongo.remove(filters, true, appConf.surveyCollections.survey).then(result => {
            http.success(res, {
                affected: result.result.n
            });
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
}

/** Answer Management Services */
function getAllResultsBySurveyId(req, res) {

    var userid = 'undefined';
    var version = '1';

    if (req.query.uid !== undefined) {
        userid = req.query.uid;
    }

    if (req.query.v !== undefined) {
        version = req.query.v;
    }

    var filters = {
        surveyid: req.params.surveyId + "",
        userid: userid,
        version: version
    };

    var sort = {
        created_at: -1
    };

    mongo.find(filters, appConf.surveyCollections.result, sort).then(results => {
            http.success(res, results);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });

}

function getResultById(req, res) {

    var body = req.body;

    var filters = {
        resultid: req.params.resultId
    }

    mongo.find(filters, appConf.surveyCollections.result).then(results => {
            http.success(res, results);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
}

function saveResult(req, res) {

    var body = req.body;
    var resultid = 'undefined';
    var userid = 'undefined';
    var version = '1';

    if (body.resultid === undefined || body.resultid == null) {
        resultid = uuidv4();
    } else {
        resultid = body.resultid;
    }

    if (body.userid !== undefined) {
        userid = body.userid;
    }

    if (body.version !== undefined) {
        version = body.version;
    }

    var filters = {
        surveyid: body.surveyid,
        resultid: resultid,
        version: version,
        userid: userid,

    }

    var data = {
        surveyid: body.surveyid,
        resultid: resultid,
        version: version,
        userid: userid,
        result: body.result,
        created_at: new Date(),
        modified_at: new Date(),
    }

    mongo.insert(filters, data, appConf.surveyCollections.result).then(result => {
            http.success(res, result);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50000, "mongo error: " + err);
            return false;
        });
}

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

// /v2/users
router.get('/users/profile', users.getProfile);

module.exports = router;