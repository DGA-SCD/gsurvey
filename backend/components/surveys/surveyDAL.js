const Promise = require('promise');
const MongoClient = require('mongodb').MongoClient
const appConf = require('../../config/production.conf');
const winston = require('../../commons/logger');
const logger = winston.logger;

const COLLECTION_QUESTION = 'question';

var Model = function(){};

Model.prototype.getQuestions = async function(ctx){
    var data;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then(  async function(db){
            logger.info("successfully connected MongoDB");
            await db.db('seminar').collection('question').findOne({name: ctx}, function (error, response) {
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
            db.db('seminar').collection('question').findOneAndReplace({name: ctx.name}, ctx, {upsert: true}, function (error, response) {
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
    });
    return {success: true, data: "", err: ""};
}

Model.prototype.getAnswer = async function(ctx){
    var data;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then(  async function(db){
            logger.info("successfully connected MongoDB");
            await db.db('seminar').collection('answer').findOne(ctx, function (error, response) {
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

Model.prototype.setAnswer = async function(ctx){
    var res;
    await MongoClient.connect(appConf.mongoDB, { useNewUrlParser: true })
    .then( async function(db){
            logger.info("successfully connected MongoDB");
            var filters = {name: ctx.name
                ,employeeId: ctx.employeeId
                ,version: ctx.version
            };
            logger.debug("filter: " + JSON.stringify(filters));
            db.db('seminar').collection('answer').findOneAndReplace(filters, ctx, {upsert: false}, function (error, response) {
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
    });
    return {success: true, data: "", err: ""};
}

module.exports = Model;
