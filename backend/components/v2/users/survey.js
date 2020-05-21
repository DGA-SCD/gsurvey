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

const {logger} = require('../../../commons/logger');
const http = require('../..//../commons/http');
const appConf = require('../../../config/production.conf');
const uuidv4 = require('uuid/v4');
const mongo = require('../../helpers/mongodb');
const surveyModel = require('../../../model/v2/survey');


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

    mongo.find(filters, appConf.surveyCollections.survey, {}).then(results => {
            http.success(res, results[0]);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongodb error: " + err);
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
        version: body.version,
        created_at: new Date(),
        modified_at: new Date(),
    };

    mongo.insertOne(data, appConf.surveyCollections.result).then(result => {
            http.success(res, result);
            return true;
        })
        .catch(err => {
            http.error(res, 500, 50002, "mongodb error: " + err);
            return false;
        });
}

async function authSurvey(req, res) {

    const surveyId = req.body.surveyid;
    const password = req.body.password;
    const userId = req.body.userid;
    let version = req.body.version;

    if (surveyId === undefined) {
        http.error(res, 400, 40000, "Not found surveyid");
        return false;
    }

    if (password === undefined) {
        http.error(res, 400, 40000, "Not found password");
        return false;
    }

    if (userId === undefined) {
        http.error(res, 400, 40000, "Not found userId");
        return false;
    }

    if (version === undefined) {
        version = '1';
    }

    try {
        const response = await surveyModel.findOne({
            surveyid: surveyId,
            userid: userId,
            version: version
        }, {}, {});

        console.log('authen survey : ', response);

        if (response.length < 1 ) {
            http.error(res, 404, 40400, 'not found survey');
            return false;
        } 

        if (response[0].password_enable === undefined || response[0].password_enable === false || response[0].password == undefined) {
            http.error(res, 400, 40001, 'this survey no need to authen');
            return false;
        }

        if (response[0].password === password) {
            http.success(res);
            return true;
        } else {
            http.error(res, 401, 40100, 'invalid password');
            return false;
        }
    } catch (err) {
        logger.error(`authen survey error: ${err}`);
        http.error(res, 500, 50002, err.toString());
        return false;
    }

}

module.exports = {
    getSurveyById,
    saveResult,
    authSurvey,
};