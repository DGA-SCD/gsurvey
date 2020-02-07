const MongoClient = require('mongodb').MongoClient
const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const promise = require('promise');

function find(filters, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).find(filters).toArray(function (err, results) {
                        if (err) {
                            logger.error('Error occurred while querying: ' + err);
                            db.close();
                            reject(err);
                        } else {
                            console.log(results);
                            logger.debug('results: ' + JSON.stringify(results));
                            db.close();
                            resolve(results);
                        }
                    })
            })
            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

function insert(filters, data, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).findOneAndReplace(filters, data, {
                        upsert: true
                    }, function (err, result) {
                        if (err) {
                            logger.error('Error occurred while inserting: ' + err);
                            db.close();
                            reject(err);
                        } else {
                            logger.debug('inserted record: ' + JSON.stringify(result));
                            db.close();
                            resolve(true);
                        }
                    })
            })
            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

function update(filters, data, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).updateOne(filters, data, {
                        upsert: false
                    }, function (err, result) {
                        if (err) {
                            logger.error('Error occurred while updating: ' + err);
                            db.close();
                            reject(err);
                        } else {
                            logger.debug('updated record: ' + JSON.stringify(result));
                            db.close();
                            resolve(true);
                        }
                    })
            })
            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

function remove(filters, justOne, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).deleteOne(filters, function (err, results) {
                        if (err) {
                            logger.error('Error occurred while querying: ' + err);
                            db.close();
                            reject(err);
                        } else {
                            console.log(results);
                            logger.debug('results: ' + JSON.stringify(results));
                            db.close();
                            resolve(results);
                        }
                    })
            })

            .catch(function (err) {
                logger.error("Failed to connection MongoDB:" + err);
                reject(err);
            });
    })
}

module.exports = {
    find,
    insert,
    update,
    remove
}