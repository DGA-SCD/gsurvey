const mysql = require('mysql');
const winston = require('../../commons/logger');
const appConf = require('../../config/production.conf');
const logger = winston.logger;
const promise = require('promise');

// mysql connection
function getConnection() {
    var conn = mysql.createConnection({
        host: appConf.MYSQL_host,
        port: appConf.MYSQL_port,
        user: appConf.MYSQL_user,
        password: appConf.MYSQL_password,
        database: appConf.MYSQL_database
    });
    return new promise(function (resolve, reject) {
        conn.connect(function (err) {
            if (err) {
                logger.error("mysql connect failed");
                reject(err);
            } else {
                logger.debug("mysql connected");
                resolve(conn);
            }
        })
    });
}


function query(conn, qstr) {
    console.log("Query String: " + qstr);
    return new promise((resolve, reject) => {
        conn.query(qstr, (err, results, fields) => {
            if (err) {
                logger.error("sql query error: " + err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    getConnection,
    query
}