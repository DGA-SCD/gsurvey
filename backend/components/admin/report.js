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

// Food Detial Mapping

const FOOD_CONDITION = {};
FOOD_CONDITION['1'] = "กินได้ทุกอย่าง";
FOOD_CONDITION['2'] = "ฮาลาล";
FOOD_CONDITION['3'] = "มังสวิรัติ";
FOOD_CONDITION['4'] = "ไม่ทานเนื้อวัว";

/**
 * covert array of food conditions to string
 * 
 * @param {*} food array of food conditions.
 */
function foodConditionToString( food ){
    var listOfFood = "";

    if( food == undefined || food.length < 1){
        logger.debug("error: invalid input with undefined or empty");
        return "";
    }

    for( let i = 0; i < food.length ; i++ ){
        if( FOOD_CONDITION[food[i]] != undefined ){
            listOfFood += FOOD_CONDITION[food[i]];
            if( i < (food.length-1) && food.length > 1 ){
                listOfFood += ",";
            }
        }else{
            logger.debug("error: invalid input with is undifined type : " + food[i]);
        }
    }
    return listOfFood;
}

/**
 * 
 * convert array of meal to cost object
 * 
 * @param {*} cost user cost object
 * @param {*} meal array of meal
 */
function mealUpdate( userCost, meal ){

    if( userCost == undefined ){
        logger.debug('error: invalid userCost with undefined');
        return false;
    }

    if( meal == undefined || meal.length < 1 ){
        logger.debug('invalid meal with undefined');
        return true;
    }

    for( let i = 0; i < meal.length ; i++){
        switch( meal[i] ){
            case '1': 
                userCost.follwerMealD1_breakfast = 1;
                break;
            case '2':
                userCost.follwerMealD1_lunch = 1;
                break;
            case '3':
                userCost.follwerMealD2_breakfast = 1;
                break;
            case '4':
                userCost.follwerMealD2_lunch = 1;
                break;
            case '5': 
                userCost.follwerMealD3_lunch = 1;
                break;
        }
    }
    return true;
}

/**
 * 
 * @param {*} users list of user objects 
 * @param {*} query_result query result from MariaDB
 */
function setUsers( users , query_result ){
    for( let i = 0 ; i < query_result.length ; i++){
        const r = query_result[i];
        if( r.UserID != undefined ){
            users[r.UserID] = {
                userId: r.UserID,
                fullname: r.Name + " " + r.Surname,
                department: r.Department,
                segment: r.Segment,
            };
        }
    }
}

/**
 *
 * @param {*} users List of user details 
 * @param {*} userCost List of cost
 * @param {*} query_result query result from MongoDB
 */
function setCost( users, userCost, query_result){
    for(let i = 0; i < query_result.length; i++) {
        const sr = query_result[i].surveyresult;
        const r = query_result[i];
        // console.log("Survey Result: " + JSON.stringify(r));
        // surveyresult: 
        // { level: 1,
        // yourname: 'ณรงค์ศักดิ์ มาลา',
        // readytogo: 'Yes',
        // howtogo: '1',
        // datetogo: '1',
        // datetoback: '2',
        // typeofsleep: 'roommate',
        // food: [ '1' ],
        // insurance_benefit: 'ติ๋ม มาลา',
        // insurance_benefit_relation: 'แม่',
        // employee_contact: '0931276505',
        // follower: 'Yes',
        // detailfollower: [ [Object], [Object] ],
        // partner: 'นพดล ซันกูล / 080486 / DD1-G' } }
        // follwerid: '1260300068146',
        // follwer_name: 'ติ๋ม มาล',
        // follwer_age: '68',
        // follwer_jointoeat: [ '4', '5', '6' ],
        // follwermakeinsurance: '1',
        // follwer_insurance: 'ติ๋ม',
        // follwer_insurance_relation: 'แม่',
        // follower_disease1: 'ไม่มี' }
        if( r.employeeId != undefined ){
            // console.log( "Employee ID: " + r.employeeId );
            /* There are follower */
            // console.log( "All Followers: " + JSON.stringify(sr.detailfollower) );
            if( sr.detailfollower != undefined && sr.detailfollower.length > 0 ){
                for( let j = 0; j < sr.detailfollower.length; j++ ){
                    const f = sr.detailfollower[j];
                    // console.log( "Follower Details: " + JSON.stringify(f) );
                    var c = {
                        join: (sr.readytogo == 'Yes')?"ไป":"ไม่ไป",
                        checkinDate: sr.datetogo,
                        checkoutDate: sr.datetoback,
                        staffFood: foodConditionToString(sr.food),
                        beneficiary: sr.insurance_benefit,
                        relationship: sr.insurance_benefit_relation,
                        emergencyContractPhoneNumber: sr.employee_contact,
                        follower: (sr.follower == 'Yes')?"มี":"ไม่มี",
                        followerCardID: f.follwerid,
                        followerFullName: f.follwer_name,
                        follwerMealD1_breakfast: 0,
                        follwerMealD1_lunch: 0,
                        follwerMealD2_breakfast: 0,
                        follwerMealD2_lunch: 0,
                        follwerMealD3_lunch: 0,
                        followerApplyInsurance: (f.follwermakeinsurance == '1')?"สมัคร":"ไม่สมัคร",
                        followerBeneficiary: f.ollwer_insurance,
                        RelationOfBeneficiary: f.follwer_insurance_relation,
                        congenitalDisease: f.follower_disease1
                    };
                    
                    /* DONOT change order */
                    mealUpdate(c, f.follwer_jointoeat);
                    c.userId = users[r.employeeId].userId,
                    c.fullname = users[r.employeeId].fullname,
                    c.department = users[r.employeeId].department,
                    c.segment = users[r.employeeId].segment,
                    userCost.push(c);

                }
            }else{ /* No follower */
                var c = {
                    join: (sr.readytogo == 'Yes')?"ไป":"ไม่ไป",
                    checkinDate: sr.datetogo,
                    checkoutDate: sr.datetoback,
                    staffFood: foodConditionToString(sr.food),
                    beneficiary: sr.insurance_benefit,
                    relationship: sr.insurance_benefit_relation,
                    emergencyContractPhoneNumber: sr.employee_contact,
                    follower: "ไม่มี",
                    followerCardID: null,
                    followerFullName: null,
                    follwerMealD1_breakfast: 0,
                    follwerMealD1_lunch: 0,
                    follwerMealD2_breakfast: 0,
                    follwerMealD2_lunch: 0,
                    follwerMealD3_lunch: 0,
                    followerApplyInsurance: null,
                    followerBeneficiary: null,
                    RelationOfBeneficiary: null,
                    congenitalDisease: null
                };
                c.userId = users[r.employeeId].userId,
                c.fullname = users[r.employeeId].fullname,
                c.department = users[r.employeeId].department,
                c.segment = users[r.employeeId].segment,
                userCost.push(c);
            }
        }else{
            console.log("error: not found this employeeId " + r.employeeId + " :: " + JSON.stringify(r));
        }
    }
}

// Providing list of cost
function billing( req, res ){
    var qstr = "SELECT \
        UserID, \
        Name, \
        Surname, \
        Department, \
        Segment \
    FROM user_details;";
    var users = {};
    var userCost = [];
    var mysql = helperMySQL.getConnection();
    // logger.debug("Try to query : " + qstr);
    return new promise((resolve, reject) =>{
        mysql.catch( err => {
                http.error(res, 500, 50000, err);
                reject( err );
            })
            .then( conn => {
                conn.query(qstr, function( err, result, fields){
                    if( err ) { 
                        http.error(res, 500, 50000, err);
                        reject( err );
                    }
                    // logger.debug("Query Result: " + JSON.stringify(result));
                    setUsers(users, result);
                    conn.end();

                    MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
                    .then( conn => {
                       
                        conn.db(appConf.MONGODB_dbname).collection('answer').find({},{name: '1', version: '1', surveyresult: '1'},).toArray(function(err, response){
                            setCost(users, userCost, response);
                            // console.log( "userCost: " + JSON.stringify(userCost) );
                            http.success(res, 
                                {
                                columns: schema.cost(),
                                data: userCost
                            });
                            resolve(true);
                        });
                    })
                    .catch( err => {
                        http.error(res, 500, 50000, err);
                        reject( err );
                    });
                });
            });
    });
}

module.exports = {
    foodConditionToString,
    mealUpdate,
    setUsers,
    setCost,
    billing
}