module.exports = {
    accessLog: "access.log",
    applicationLog: 'application.log',
    mongoDB: 'mongodb://127.0.0.1:27017/seminar',
    MONGODB_dbname: 'gsurvey',
    
    surveyCollections: {
        survey: "survey",
        result: "result"
    },

    MYSQL_host: "127.0.0.1",
    MYSQL_port: 3306,
    MYSQL_user: "root",
    MYSQL_password: "your_password",
    MYSQL_database: "your_db_name",

    REDIS_host: "127.0.0.1",
    REDIS_port: 6379,
    REDIS_pass: "",

    seminarDB: {
        userDetail: "user_details"
    },

    access_control_allow: {
        origin: 'http://localhost:3005, http://localhost',
        methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        headers: 'X-Requested-With,content-type',
        credentials: true,
    },

    cookies: {
        signed: true,
        secreteKey: "12345"
    },

    surveySetting: {
        version: 1,
        round: 1,
    },
    
    tokenExpiredTime: 60
};