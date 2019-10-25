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
const appConf = require('../../config/production.conf');
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const redis = require("redis");
const logger = winston.logger;
const promise = require('promise');
const helperMySQL = require('../helpers/mysql');
const MongoClient = require('mongodb').MongoClient;

/**
 * get list of rooms that display number of residents
 * @param {*} req 
 * @param {*} res 
 */
function getRooms(req, res){

    var qstr_rooms  = "SELECT Id, RoomNumber, RoomType, MaxGuest FROM rooms";
    var qstr_reserved = "SELECT max(Room) as Room, count(Room) as count FROM seminar_stag.booking GROUP by Room;"

    var mysql = helperMySQL.getConnection()
    return new promise( (resolve, reject) => {
        mysql.then( conn => {
        
            let reservedRooms =  helperMySQL.sqlquery( conn, qstr_reserved);
            let rooms = helperMySQL.sqlquery( conn, qstr_rooms);

            promise.all([reservedRooms, rooms]).then( results => {

                if ( results[0] == undefined ) {
                    logger.error( JSON.stringify(results[0]) );
                    http.error(res, 500, 50000, "Failed to query:" + results[0].err );
                    reject( err );
                } 

                if( results[1] == undefined ) {
                    logger.error( JSON.stringify(results[1]) );
                    http.error(res, 500, 50000, "Failed to query:" + results[1].err );
                    reject( err );
                }

                const reserved = {};
                results[0].forEach( e => {
                    reserved[e.Room] = {count: e.count};
                });
                
                var data = {};

                results[1].forEach(e => {
                    data[e.Id] = e.RoomNumber + " " + e.RoomType + " (" + ((reserved[e.Id]==undefined)?0:reserved[e.Id].count) + "/" + e.MaxGuest + ")" ;
                });
                
                http.success(res, data);
                resolve(data);

            }).catch(err => {
                http.error(res, 500, 50000, "error: " + err);
                reject(false);
            });
        })
        .catch( err => {
            http.error(res, 500, 50000, "error: " + err);
            reject(false);
        })
    });
}


module.exports = {
    getRooms,
}

