const appConf = require('../../config/production.conf');
const redis = require('redis');
const promise = require('promise');
const {
    logger
} = require('../../commons/logger');

function getRedisConnection() {

    const redisCli = redis.createClient({
        port: appConf.REDIS_port, // replace with your port
        host: appConf.REDIS_host, // replace with your hostanme or IP address
        password: appConf.REDIS_pass,
    });

    return new promise(function (resolve, reject) {
        redisCli.on("error", function (err) {
            if (err) {
                logger.error("redis: " + err);
                reject(err);
            }
        });

        redisCli.on("connect", function () {
            resolve(redisCli);
        });
    });
}

function redisSet(redisCli, key, value, exp) {
    let expire = exp !== undefined ? exp : 3600;
    logger.debug("Begin to set value on redis " + "key=[" + key + "]" + "value=[" + value + "]");
    return new promise(function (resolve, reject) {
        redisCli.set(key, value, 'EX', expire, function (err, reply) {
            if (err) {
                logger.error("redis: " + err);
                reject(err);
            } else {
                logger.debug("redis: " + reply);
                resolve(reply);
            }
        });
    });
}

function redisGet(redisCli, key) {
    return new promise(function (resolve, reject) {
        redisCli.get(key, function (err, reply) {
            if (err) {
                logger.error("redis: " + err);
                reject(err);
            } else {
                logger.debug("redis: " + reply);
                resolve(reply);
            }
        });
    });
}

function redisDel(redisCli, key) {

    logger.debug("delete redis key=[" + key + "]");
    return new promise(function (resolve, reject) {
        redisCli.del(key, function (err, reply) {
            if (err) {
                logger.error("redis: " + err);
                reject(err);
            } else {
                logger.debug("redis: " + reply);
                resolve(reply);
            }
        });
    });
}

module.exports = {
    getRedisConnection,
    redisSet,
    redisGet,
    redisDel,
}