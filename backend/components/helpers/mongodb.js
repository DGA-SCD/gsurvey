const MongoClient = require('mongodb').MongoClient
const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const promise = require('promise');

var db;

function getPoolConnection(){
    if( db !== undefined ){
        return db;
    } else {
        db = MongoClient.connect(appConf.mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: appConf.MONGODB_connection_pool,
            minSize: appConf.MONGODB_connection_min,
        });
        return db;
    }

}

function findWithProjector(filters, collection, projector, sort) {
    return _find(filters, collection, projector, sort, 0 , 0);
}

function findWithPaging(filters, collection, projector, sort, limit , skip){
    return _find(filters, collection, {_id: 0, ...projector}, sort, limit, skip); 
}

function find(filters, collection, sort) {
    return _find(filters, collection, {
        projection: {
            _id: 0
        }
    }, sort, 0, 0);
}

function _find(filters, collection, projector, sort, limit, skip) {
    console.log("limit: " + limit + " skip: " + skip + " projector: " + JSON.stringify(projector));
    return new promise((resolve, reject) => {
        getPoolConnection().then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).find(filters).project(projector).skip(skip).limit(limit).sort(sort).toArray(function (err, results) {
                        if (err) {
                            logger.error('Error occurred while querying: ' + err);
                            reject(err);
                        } else {
                            logger.debug('search results: ' + JSON.stringify(results));
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
                useNewUrlParser: true,
                useUnifiedTopology: true
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

function insertOne(data, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).insertOne(data, function (err, result) {
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
                useNewUrlParser: true,
                useUnifiedTopology: true
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
                            resolve(result);
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
                useNewUrlParser: true,
                useUnifiedTopology: true
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
                            logger.debug('delete result: ' + JSON.stringify(results));
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

function count(filters, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).countDocuments(filters, function (err, results) {
                        if (err) {
                            logger.error('Error occurred while counting: ' + err);
                            db.close();
                            reject(err);
                        } else {
                            logger.debug('result count: ' + JSON.stringify(results));
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
    findWithProjector,
    find,
    insert,
    insertOne,
    update,
    remove,
    count,
    findWithPaging,
}