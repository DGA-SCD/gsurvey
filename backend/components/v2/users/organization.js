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
const http = require('../..//../commons/http');
const appConf = require('../../../config/production.conf');
const mysql = require('../../helpers/mysql');

function getMinistries(req, res) {

    const qstr = "SELECT ministry_code as min_id, ministry_name as min_name \
    FROM ministry WHERE active_flag = 1";

    mysql.getConnection()
        .then(conn => {
            return mysql.query(conn, qstr)
                .then(result => {
                    http.success(res, result);
                    conn.destroy();
                    return Promise.resolve(result.length);
                })
        })
        .then(l => {
            logger.debug("query ministry: " + l + " records");
        }).catch(err => {
            http.error(res, 500, 50002, err);
        });
}

function getDepartments(req, res) {

    const min_id = req.query.ministryId;

    if (min_id === undefined) {
        http.error(res, 400, 40000, "Not found ministryId");
        return;
    }

    const qstr = "SELECT dep_id as dep_id, dep_name as dep_name \
    FROM department WHERE active_flag = 1 and ministry_code = '" + min_id + "'";

    mysql.getConnection()
        .then(conn => {
            return mysql.query(conn, qstr)
                .then(result => {
                    http.success(res, result);
                    return Promise.resolve(result.length);
                })
        })
        .then(l => {
            logger.debug("query department: " + l + " records");
        }).catch(err => {
            http.error(res, 500, 50002, err);
        });
}

function getOrganizations(req, res) {

    const dep_id = req.query.departmentId;

    if (dep_id === undefined) {
        http.error(res, 400, 40000, "Not found ministryId");
        return;
    }

    const qstr = "SELECT org_code as org_id, org_name as org_name \
    FROM organization WHERE active_flag = 1 and dep_id='" + dep_id + "'";

    mysql.getConnection()
        .then(conn => {
            return mysql.query(conn, qstr)
                .then(result => {
                    http.success(res, result);
                    return Promise.resolve(result.length);
                })
        })
        .then(l => {
            logger.debug("query organization: " + l + " records");
        }).catch(err => {
            http.error(res, 500, 50002, err);
        });
}

function getPrefixes(req, res) {

    const qstr = "SELECT prefix_id as id, prefix_name as name FROM prefix";

    mysql.getConnection()
        .then(conn => {
            return mysql.query(conn, qstr)
                .then(results => {
                    conn.destroy();
                    http.success(res, results);
                    return Promise.resolve(results.length);
                });
        }).then((l) => {
            logger.debug("query prefixes: " + l + " records");
        })
        .catch(err => {
            http.error(res, 500, 50002, err);
        });
}

module.exports = {
    getMinistries,
    getDepartments,
    getOrganizations,
    getPrefixes,
}