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
} = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const promise = require('promise');
const mongodb = require('../../components/helpers/mongodb');

function find(filter, projection, sort) {
    return mongodb.findWithProjector(filter, appConf.surveyCollections.survey, projection, sort);
}

function findWithPaging(filter, projector, sort, page_size, page) {
    return mongodb.findWithPaging(filter, appConf.surveyCollections.survey, projector, sort, page_size, page);
}

function findOneAndReplace(filter, survey) {
    const data = {
        userid: survey.userid,
        name: survey.name,
        surveyid: survey.surveyid,
        version: survey.version,
        password: survey.password,
        password_enable: survey.password_enable,
        pages: survey.pages,
        created_at: survey.created_at,
        modified_at: survey.created_at,
    }

    return mongodb.insert(filter, data, appConf.surveyCollections.survey);
}

function count(filter) {
    return mongodb.count(filter, appConf.surveyCollections.survey)
        .then(r => {
            return Promise.resolve(r);
        })
        .catch(err => {
            console.log("count error: " + err);
            return Promise.resolve(0);
        });
}

function updateOne(filter, data) {
    return mongodb.update(filter, data, appConf.surveyCollections.survey);
}

function removeOne(filter) {
    return mongodb.remove(filter, true, appConf.surveyCollections.survey);
}

module.exports = {
    find,
    findWithPaging,
    findOneAndReplace,
    count,
    updateOne,
    removeOne
}