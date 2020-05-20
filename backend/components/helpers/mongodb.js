const MongoClient = require('mongodb').MongoClient
const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const promise = require('promise');

var db;

function getPoolConnection() {
    if (db !== undefined) {
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

function findWithProject(filter, collection, project, sort) {
    return _find(filter, collection, project, sort, 0, 0);
}

function findWithPaging(filter, collection, project, sort, limit, skip) {
    return _find(filter, collection, {
        _id: 0,
        ...project
    }, sort, limit, skip);
}

function find(filter, collection, sort) {
    return _find(filter, collection, {
        _id: 0
    }, sort, 0, 0);
}

function findOne(filter, collection, project, sort) {
    return _find(filter, collection, {
        _id: 0,
        ...project
    }, sort, 1, 0);
}

function _find(filter, collection, project, sort, limit, skip) {
    console.log("limit: " + limit + " skip: " + skip + " project: " + JSON.stringify(project));
    return new promise((resolve, reject) => {
        getPoolConnection().then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).find(filter).project(project).skip(skip).limit(limit).sort(sort).toArray(function (err, results) {
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

function insert(filter, data, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).findOneAndReplace(filter, data, {
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

function update(filter, data, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).updateOne(filter, data, {
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

function remove(filter, justOne, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).deleteOne(filter, function (err, results) {
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

function count(filter, collection) {
    return new promise((resolve, reject) => {
        MongoClient.connect(appConf.mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(db => {
                logger.debug("mongodb connected");
                db.db(appConf.MONGODB_dbname)
                    .collection(collection).countDocuments(filter, function (err, results) {
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
    findWithProject,
    find,
    insert,
    insertOne,
    update,
    remove,
    count,
    findWithPaging,
    findOne,
}