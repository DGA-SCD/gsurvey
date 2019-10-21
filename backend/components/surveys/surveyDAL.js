const Promise = require('promise');
const MongoClient = require('mongodb').MongoClient
const appConf = require('../../config/production.conf');
const winston = require('../../commons/logger');
const mysqlHelper = require('../helpers/mysql');
const http = require('../../commons/http');
const logger = winston.logger;
const promise = require('promise');

const COLLECTION_QUESTION = 'question';

var Model = function(){};

Model.prototype.getQuestions = async function(ctx){
    var data;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then(  async function(db){
            logger.info("successfully connected MongoDB");
            await db.db(appConf.MONGODB_dbname).collection('question').findOne({name: ctx}, function (error, response) {
                if(error) {
                    console.log('Error occurred while inserting');
                } else {
                   console.log('response: ', response);
                   data = response;
                   
                }
                
            });
            await db.close();
    }).catch( function(err){
        logger.error("Failed to connection MongoDB");
    });
    console.log(data);
    return data;
}

Model.prototype.setQuestions = async function(ctx){
    var res;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then( async function(db){
            logger.info("successfully connected MongoDB");
            db.db(appConf.MONGODB_dbname).collection('question').findOneAndReplace({name: ctx.name}, ctx, {upsert: true}, function (error, response) {
                if(error) {
                    console.log('Error occurred while inserting');
                } else {
                   console.log('inserted record', response);
                   res = response;
                }
            });
            await db.close();
    }).catch( function(err){
        logger.error("Failed to connection MongoDB:" + err);
        return {success: false, data: "", err: "Failed to connection MongoDB:" + err};
    });
    
}

Model.prototype.getAnswer = async function(ctx){
    var data;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then(  async function(db){
            logger.info("successfully connected MongoDB");
            await db.db(appConf.MONGODB_dbname).collection('answer').findOne(ctx, function (error, response) {
                if(error) {
                    console.log('Error occurred while inserting');
                } else {
                   console.log('response: ', response);
                   data = response;
                }
            });
            await db.close();
    }).catch( function(err){
        logger.error("Failed to connection MongoDB");
    });
    console.log(data);
    return data;
}

function getVehicleType(ctx) {
    if ( (s = ctx.surveyresult) !== undefined && s.howtogo !== undefined ){
        console.log("Howtogo: " + s.howtogo);
        return s.howtogo
    }
    logger.debug("warn: cannot get vehicle type");
    return 0;
}

function getJoin(ctx) {
    
    if ( (s = ctx.surveyresult) !== undefined && s.readytogo !== undefined ){
        console.log("Ready to go : " + s.readytogo);
        return ( s.readytogo == "Yes")?1:0;
    }
    logger.debug("warn: cannot get vehicle type");
    return 0;
}


function sqlquery(conn, qstr , cb){
    console.log( "Query String: " + qstr );
    return new promise( (resolve, reject) => {
        conn.query( qstr, (err, result) => {
            if ( err ){ 
                logger.error("sql query error: " + err);
                reject( err );
            }
            else {
                logger.debug("Query Success : " + JSON.stringify(result));
                resolve( result );
            }
        });
    });
}

Model.prototype.setAnswer = function(req, res){

    var ctx = req.body;
    ctx.USERID = req.USERID;
    
    var mysql = mysqlHelper.getConnection();
    const qstr = "UPDATE user_stats \
    set IsAnswer = 1 \
    WHERE UserID = '" + ctx.USERID + "' and Round = '" +  appConf.surveySetting.round + "'";

    const qstr2 = "UPDATE booking \
    set Vehicle = " + getVehicleType(ctx) + ", \
    `Join` = " + getJoin(ctx) +
    " WHERE UserID = '" + ctx.USERID + "'";

    return new promise( (resolve, reject) => {
    MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true }).then( db => {

        logger.info("successfully connected MongoDB");

        var filters = {name: ctx.name
            ,employeeId: ctx.employeeId
            ,version: ctx.version
        };

        logger.debug("filter: " + JSON.stringify(filters));

        db.db(appConf.MONGODB_dbname).collection('answer').findOneAndReplace(filters, ctx, {upsert: true}, function (error, response) {
            if(error) {
                console.log('Error occurred while inserting');
                reject( error );
                http.error(res, 500, 50000, "Error occurred while inserting: " + error );
            } 
            else {
                console.log('inserted answer record: ', response);
                
                mysql.then( conn => {

                    let update_user_stats =  sqlquery( conn, qstr);
                    let update_booking_vehicle = sqlquery( conn, qstr2);

                    promise.all([update_user_stats, update_booking_vehicle]).then( (results) => {
                        if( results[0] ==  undefined ){
                            logger.error( JSON.stringify(results[0]) );
                            http.error(res, 500, 50000, "Failed to query:" + results[0].err );
                            reject( err );
                        }else{
                            logger.debug( 'update user stats successful: ');
                        }
                        
                        if( results[1] == undefined ){
                            logger.error( JSON.stringify(results[1]) );
                            http.error(res, 500, 50000, "Failed to query:" + results[1].err );
                            reject( err );
                        }else{
                            logger.debug( 'update booking vehicle successful: ');
                        }

                        http.success( res );
                        resolve( true );
                        logger.debug( 'success');
                    });
                })
            .catch( err => {
                logger.error( "MongoDB error :" + err );
                http.error(res, 500, 50000, "MongoDB error :" + err );
                reject( err );
            });
            }
        });
        }).catch( function(err){
            logger.error("Failed to connection MongoDB:" + err);
            http.error(res, 500, 50000, "Failed to connection MongoDB:" + err );
            reject( err );
        });
    });
}

module.exports = Model;
