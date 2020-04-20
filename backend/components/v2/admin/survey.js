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
const http = require('../../../commons/http');
const appConf = require('../../../config/production.conf');
const promise = require('promise');
const MongoClient = require('mongodb').MongoClient
const redis = require("redis");
const mongo = require('../../helpers/mongodb');
const uuidv4 = require('uuid/v4');

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
                    http.error(res, 500, 50002, "mongo error: " + err);
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
                    http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
            return false;
        });
}

/** Answer Management Services */
async function getAllResultsBySurveyId(req, res) {

    const DEFAULT_PER_PAGE = 100;
    var userid = 'undefined';
    var version = '1';
    var per_page = DEFAULT_PER_PAGE;
    var page = 1;
    var total = 0;

    if (req.query.uid !== undefined) {
        userid = req.query.uid;
    }

    if (req.query.v !== undefined) {
        version = req.query.v;
    }

    if (req.query.page !== undefined) {
        page = parseInt(req.query.page);
        page = (page <= 0) ? 1 : page;
    }

    if (req.query.per_page !== undefined) {

        per_page = parseInt(req.query.per_page);
        per_page = (per_page <= 0) ? DEFAULT_PER_PAGE : per_page;
    }

    var filters = {
        surveyid: req.params.surveyId + "",
        userid: userid,
        version: version
    };

    var sort = {
        created_at: -1
    };

    console.log(filters, page, per_page);

    await mongo.count(filters, appConf.surveyCollections.result)
    .then(result => {
        total = result;
        console.log("result: " + total);
    })
    .catch(err => {
        http.error(res, 500, 50002, "mongo error: " + err);
        return false;
    });

    await mongo.findWithPaging(filters, appConf.surveyCollections.result, sort, per_page, ((page-1)*per_page))
        .then(results => {
            console.log("result: " + results);
            http.successStream(res, results, {per_page: per_page, page: page, total: total});
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
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
            http.error(res, 500, 50002, "mongo error: " + err);
            return false;
        });
}

module.exports = {
    saveSurvey,
    createEmptySurvey,
    getAllSurveysByOwnerId,
    getSurveyById,
    renameSurvey,
    deleteSurvey,
    getAllResultsBySurveyId,
    getResultById,
    saveResult
}