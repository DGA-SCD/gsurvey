module.exports = {
    accessLog: "access.log",
    applicationLog: 'application.log',
    mongoDB: 'mongodb://localhost:27017/seminar',
    MONGODB_dbname: 'seminar',

    MYSQL_host: "127.0.0.1",
    MYSQL_port: 3306,
    MYSQL_user: "root",
    MYSQL_password: "",
    MYSQL_database: "seminar_stag",

    REDIS_host: "127.0.0.1",
    REDIS_port: 6379,

    seminarDB: {
        userDetail: "user_details"
    },

    cookies: {
        signed: true,
        secreteKey: "12345"
    }
};