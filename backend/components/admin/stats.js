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

const mysql = require('mysql');
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const appConf = require('../../config/production.conf');
const redis = require("redis");
const logger = winston.logger;
const promise = require('promise');
const helperMySQL = require('../helpers/mysql');
const MongoClient = require('mongodb').MongoClient;
const schema = require('./report-schema');

/**
 * count answer from MongoDB
 * @param {*} req http request
 * @param {*} res http response
 */
function getNumberofCompleteSurveyFromMongoDB( req, res ){
    return new promise( (resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
        .then( conn => {
            conn.db(appConf.MONGODB_dbname).collection('answer').countDocuments({name: "seminar-01", version: "1"}, (err, count) => {
                if ( err ) {
                    http.error(res, 500, 50000, err);
                    reject( err );
                }else{
                    http.success(res, {count: count});
                    logger.debug('query result: number of complete survey is ' + count);
                    resolve(true);
                }
            }) 
        })
        .catch( err => {
            http.error(res, 500, 50000, err);
            reject( err );
        });
    });
}

/**
 * count answer
 * @param {*} req http request
 * @param {*} res http response
 */
function getNumberofCompleteSurvey( req, res ){
    const qstr = "SELECT \
        sum( CASE WHEN US.IsAnswer = 1 then 1 \
        else 0 \
        END) as `Done`, \
        sum( CASE WHEN US.IsAnswer = 0 then 1 \
        else 0 \
        END ) as `NotDone`, \
        count(*) as `Total` \
    FROM user_stats as US \
    WHERE US.round = " + appConf.surveySetting.round;
    return new promise( (resolve, reject) => {
        helperMySQL.getConnection()
        .then(conn => {
            conn.query(qstr, (err, result) => {
                if ( err ) {
                    http.error(res, 500, 50000, "error: cannot query number of done survey");
                    logger.debug("error: cannot query number of done survey :: " + err);
                    reject( err );
                } else {
                    if ( result[0] != undefined && result[0].Done != undefined && result[0].NotDone != undefined && result[0].Total != undefined ) {
                        http.success( res, result[0]);
                        resolve( true );
                    }else{
                        http.error(res, 500, 50000, "error: cannot query number of done survey");
                        logger.debug("error: cannot query number of done survey");
                        reject( "error: cannot query number of done survey" );
                    }
                }
            })
        })
        .catch( err => {
            http.error(res, 500, 50000, err);
            reject( err );
        });
    });
}

/**
 * count all staff
 * @param {*} req 
 * @param {*} res 
 */
function getTotalStaff( req, res ){

    const qstr = "SELECT count(*) as count FROM user_details";
    var mysql = helperMySQL.getConnection();

    return new promise( (resolve, reject) => {
        mysql.then( conn => {
            conn.query(qstr, (err, result, fields) => {
                if ( err ) {
                    http.error(res, 500, 50000, err);
                    reject( err );
                    conn.end();
                }else{
                    if ( result[0] == undefined || result[0].count == undefined ){
                        http.error(res, 500, 50000, "error: cannot query number of total staff");
                        logger.debug("error: cannot query number of total staff");
                        reject( err );
                    } else {
                        http.success(res, {count: result[0].count});
                        logger.debug("total staff is " + result[0].count);
                        resolve(true);
                    }
                    conn.end();
                }
            })
        })
        .catch( err => {
            http.error(res, 500, 50000, err);
            reject( err );
        });
    });
}

/**
 * get list of done survey by segment
 * @param {*} req 
 * @param {*} res 
 */
function getDoneSurveyBySegment( req, res ){

    const qstr = "SELECT \
	Segment, \
	max(Department) as Department, \
	sum( CASE WHEN US.IsAnswer = 1 then 1 \
    else 0 \
    END) as `Done`, \
    sum( CASE WHEN US.IsAnswer = 0 then 1 \
	else 0 \
	END ) as `NotDone`, \
    count(*) as `Total` \
    FROM user_stats as US \
    LEFT JOIN user_details as UD on US.UserID = UD.UserID \
    WHERE US.round = 1 \
    GROUP BY Segment";
    var mysql = helperMySQL.getConnection();

    return new promise( (resolve, reject) => {
        mysql.then( conn => {
            conn.query(qstr, (err, result, fields) => {
                if ( err ) {
                    http.error(res, 500, 50000, err);
                    reject( err );
                    conn.end();
                }else{
                    
                    if ( result == undefined ){
                        http.error(res, 500, 50000, "error: cannot query number of total staff");
                        logger.debug("error: cannot query number of total staff");
                        reject( err );
                    } else {
                        var jresult = result.map((row)=>{return {...row}});
                        http.success(res, jresult);
                        logger.debug("getDoneSurveyBySegment: total records is " + jresult.length);
                        resolve(jresult.length);
                    }
                    conn.end();
                }
            })
        })
        .catch( err => {
            http.error(res, 500, 50000, err);
            reject( err );
        });
    });
}

/**
 * get list of done survey by department
 * @param {*} req 
 * @param {*} res 
 */
function getDoneSurveyByDepartment( req, res ){

    const qstr = "SELECT \
	Department, \
	sum( CASE WHEN US.IsAnswer = 1 then 1 \
    else 0 \
    END) as `Done`, \
    sum( CASE WHEN US.IsAnswer = 0 then 1 \
	else 0 \
	END ) as `NotDone`, \
    count(*) as `Total` \
    FROM user_stats as US \
    LEFT JOIN user_details as UD on US.UserID = UD.UserID \
    WHERE US.round = 1 \
    GROUP BY Department";
    var mysql = helperMySQL.getConnection();

    return new promise( (resolve, reject) => {
        mysql.then( conn => {
            conn.query(qstr, (err, result, fields) => {
                if ( err ) {
                    http.error(res, 500, 50000, err);
                    reject( err );
                    conn.end();
                }else{
                    
                    if ( result == undefined ){
                        http.error(res, 500, 50000, "error: cannot query number of total staff");
                        logger.debug("error: cannot query number of total staff");
                        reject( err );
                    } else {
                        var jresult = result.map((row)=>{return {...row}});
                        http.success(res, jresult);
                        logger.debug("getDoneSurveyBySegment: total records is " + jresult.length);
                        resolve(jresult.length);
                    }
                    conn.end();
                }
            })
        })
        .catch( err => {
            http.error(res, 500, 50000, err);
            reject( err );
        });
    });
}

module.exports = {
    getNumberofCompleteSurveyFromMongoDB,
    getDoneSurveyByDepartment,
    getNumberofCompleteSurvey,
    getDoneSurveyBySegment,
    getTotalStaff,
};