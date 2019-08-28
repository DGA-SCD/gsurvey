const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const redis = require("redis");

function verifyToken(userId, token){
    logger.debug( "userId: " + userId + " token: " + token);

    if( userId == null || token == null )
    {
        logger.error("Invalid parameters: not found userid or token");
        return false;
    }

    const redisCli = redis.createClient({
        port      : appConf.REDIS_port,               // replace with your port
        host      : appConf.REDIS_host,        // replace with your hostanme or IP address
    });

    redisCli.on("error", function (err) {
        logger.error("redis: " + err);
        // http.error(res, 500, 500000, "redis: " + err);
        return false;
    });

    redisCli.get(userId, function(err, reply){
        if( err ) {
            logger.error("redis: " + err);
            redisCli.end(true);
            // http.error(res, 500, 50000, "redis: " + err);
        } else {
            logger.debug("redis: " + reply);
            var redisToken = reply[0];
            if ( redisToken == undefined || redisToken != token ) {
                redisCli.end(true);
                // http.error(res, 401, 401000, "Invalid token");
            } else {
                logger.error("invalid user or password");
                redisCli.end(true);
                // http.error(res, 401, 401000, "invalid user or password");
            }
        }
    });

    return true;
}

module.exports = {
    verifyToken
}