const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const redis = require("redis");
const {promisify} = require('util');

async function verifyToken(userId, token, errorHandler) {
    logger.debug( "userId: " + userId + " token: " + token);

    if( userId == null || token == null )
    {
        logger.error("Invalid parameters: not found userid or token");
        errorHandler("Invalid parameters: not found userid or token");
    }

    const redisCli = redis.createClient({
        port      : appConf.REDIS_port,               // replace with your port
        host      : appConf.REDIS_host,        // replace with your hostanme or IP address
    });

    redisCli.on("error", function (err) {
        logger.error("redis: " + err);
        errorHandler("redis: " + err);
    });

    const getAsync = promisify(redisCli.get).bind(redisCli);

    var reply = await getAsync(userId);
    logger.debug("redis: " + reply);
    var redisToken = reply;

    if ( redisToken === undefined ) {
        redisCli.end(true);
        logger.error("Not found token in redis");
        errorHandler("Not found token in redis");
    } else if ( redisToken != token ) {
        redisCli.end(true);
        logger.error("token missmatch: " + redisToken + " : " + token);
        errorHandler("token missmatch: " + redisToken + " : " + token)
    } else {
        logger.debug("Token passed");
        redisCli.end(true);
        errorHandler();
    }
}

module.exports = {
    verifyToken
}