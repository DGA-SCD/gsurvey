const MongoClient = require('mongodb').MongoClient
const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const promise = require('promise');

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

module exports = {
    getConnection
}