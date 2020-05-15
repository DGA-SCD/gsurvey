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
const mysqlHelper = require('../../helpers/mysql');
const surveyModel = require('../../../model/v2/survey');
const resultModel = require('../../../model/v2/result');


/**
 * get a role of user
 * @param {userid}
 */

function getRole(userid) {

    let qstr = "SELECT roles.role_name as role " +
        "FROM users " +
        "INNER JOIN roles ON users.role_id = roles.role_id " +
        "WHERE user_id = \'" + userid + "\'";

    return mysqlHelper.getConnection()
        .then(conn => {
            return mysqlHelper.query(conn, qstr)
                .then(results => {
                    console.log(results);
                    if (results.length > 0 && results[0].role !== "") {

                        return Promise.resolve(results[0].role);
                    } else {
                        return Promise.reject("not found any role");
                    }
                })
        })
        .catch(err => {
            return Promise.reject(err);
        })
}

async function saveSurvey(req, res) {

    var body = req.body
    var searchFilters = {
        userid: body.userid,
        surveyid: body.surveyid,
        version: body.version,
    };

    let survey = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version,
        password_enable: false,
        pages: body.pages,
        created_at: new Date(),
        modified_at: new Date(),
    }

    if (body.password !== undefined && body.password !== "")  {
        survey.password = body.password;
        survey.password_enable = true;
    }

    var filters = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version
    };

    var results = undefined;
    let ret = false;

    await surveyModel.find(searchFilters, {}, {})
        .then(r => {
            results = r
        })
        .catch(err => {
            console.log(err);
        });

    if (results[0] !== undefined && results[0].created_at !== undefined) {
        console.log("created at : " + results[0].created_at);
        survey.created_at = results[0].created_at;
    }

    await surveyModel.findOneAndReplace(filters, survey)
        .then(result => {
            http.success(res, result);
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });


    return ret;

}

async function createEmptySurvey(req, res) {

    let body = req.body

    if (body.userid === undefined) {
        http.error(res, 400, 40000, 'require "userid"');
        return false;
    }

    if (body.name === undefined) {
        http.error(res, 400, 40000, 'require "name"');
        return false;
    }

    if (body.surveyid === undefined) {
        http.error(res, 400, 40000, 'require "surveyid"');
        return false;
    }

    if (body.version === undefined) {
        http.error(res, 400, 40000, 'require "version"');
        return false;
    }

    let survey = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version,
        created_at: new Date(),
        modified_at: new Date(),
    }

    let filters = {
        userid: body.userid,
        name: body.name,
        surveyid: body.surveyid,
        version: body.version
    };

    let ret = false;

    await surveyModel.findOneAndReplace(filters, survey, appConf.surveyCollections.survey)
        .then(result => {
            http.success(res, result);
            console.log(result);
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });

    return ret;
}

async function getAllSurveysByOwnerId(req, res) {

    const DEFAULT_PER_PAGE = 20;
    let per_page = DEFAULT_PER_PAGE;
    let page = 1;
    let total = undefined;
    let error = undefined;
    let ret = false;

    if (req.params.ownerid == 'undefined') {
        http.error(res, 400, 40000, "Not found owerid");
        return false;
    }

    if (req.query.page !== undefined) {
        page = parseInt(req.query.page);
        page = (page <= 0) ? 1 : page;
    }

    if (req.query.per_page !== undefined) {

        per_page = parseInt(req.query.per_page);
        per_page = (per_page <= 0) ? DEFAULT_PER_PAGE : per_page;
    }

    let userId = req.signedCookies['userid'];;

    var sort = {
        created_at: -1
    };

    var filters = {
        userid: req.params.ownerid
    };

    total = await surveyModel.count(filters);

    await getRole(userId)
        .then(role => {
            if (role === 'super admin') {
                filters = {};
            }
        }).catch(err => {
            logger.warn(err);
        });

    total = await surveyModel.count(filters);

    if (error !== undefined) {
        http.error(res, 500, 50002, "mongo error: " + error);
        return false;
    }

    await surveyModel.findWithPaging(filters, {
            password: 0
        }, sort, per_page, ((page - 1) * per_page))
        .then(results => {
            http.successStream(res, results, {
                per_page: per_page,
                page: page,
                total: total
            });
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });

    return ret;
}

async function getSurveyById(req, res) {

    let userid = 'undefined';
    let version = '1';
    let ret = false;

    if (req.query.uid === undefined) {
        http.error(res, 400, 40000, "Not found userid");
        return false;
    } else {
        userid = req.query.uid + "";
    }

    if (req.query.v !== undefined) {
        version = req.query.v + "";
    }

    if (req.params.surveyId === undefined) {
        http.error(res, 400, 40000, "Not found owerid");
        return false;
    }

    let filters = {
        surveyid: req.params.surveyId,
        version: version,
        userid: userid,
    };

    await surveyModel.find(filters, {
            password: 0
        })
        .then(results => {
            http.success(res, results[0]);
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });

    return ret;
};

async function renameSurvey(req, res) {

    let ret = false;

    let filters = {
        surveyid: req.body.surveyid,
        userid: req.signedCookies['userid'],
        version: req.body.version
    };

    let data = {
        $set: {
            name: req.body.name,
            modified_at: new Date(),
        }
    };

    await surveyModel.updateOne(filters, data)
        .then(results => {
            http.success(res, {
                "affected": results.modifiedCount
            });
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });
    return ret;
}

async function deleteSurvey(req, res) {

    let ret = false;
    let filters = {
        userid: req.signedCookies['userid'],
        surveyid: req.body.surveyid,
        version: req.body.version
    };

    await surveyModel.removeOne(filters)
        .then(result => {
            http.success(res, {
                affected: result.result.n
            });
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });

    return ret;
}

/** Answer Management Services */
async function getAllResultsBySurveyId(req, res) {

    const DEFAULT_PER_PAGE = 100;
    let userid = 'undefined';
    let version = '1';
    let per_page = DEFAULT_PER_PAGE;
    let page = 1;
    let total = 0;
    let ret = false;

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

    let filters = {
        surveyid: req.params.surveyId + "",
        userid: userid,
        version: version
    };

    let sort = {
        created_at: -1
    };

    console.log(filters, page, per_page);

    total = await resultModel.count(filters);

    await resultModel.findWithPaging(filters, {surveyid: 1}, sort, per_page, ((page - 1) * per_page))
        .then(results => {
            console.log("result: " + results);
            http.successStream(res, results, {
                per_page: per_page,
                page: page,
                total: total
            });
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });

    return ret;
}

async function getResultById(req, res) {
    let ret = false;
    let filters = {
        resultid: req.params.resultId
    }

    await resultModel.find(filters).then(results => {
            http.success(res, results);
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });
    return ret;
}

async function saveResult(req, res) {

    let body = req.body;
    let resultid = 'undefined';
    let userid = 'undefined';
    let version = '1';
    let ret = false;

    if (body.resultid === undefined || body.resultid == null) {
        resultid = uuidv4();
    } else {
        resultid = body.resultid;
    }

    if (body.userid === undefined) {
        http.error(res, 400, 40000, 'require "userid"');
        return false;
    }

    if (body.version !== undefined) {
        version = body.version;
    }

    let filters = {
        surveyid: body.surveyid,
        resultid: resultid,
        version: version,
        userid: body.userid,
    }

    let data = {
        surveyid: body.surveyid,
        resultid: resultid,
        version: version,
        userid: body.userid,
        result: body.result,
        created_at: new Date(),
        modified_at: new Date(),
    }

    await resultModel.findOneAndReplace(filters, data, appConf.surveyCollections.result)
        .then(result => {
            http.success(res, result);
            ret = true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongo error: " + err);
            ret = false;
        });
    return ret;
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