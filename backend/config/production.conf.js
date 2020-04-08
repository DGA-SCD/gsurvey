"use strict";

const assert = require("assert");
const dotenv = require("dotenv");

dotenv.config();

const {
    ACCESS_LOG,
    APPLICATION_LOG,
    MONGODB_URL,
    MONGODB_DATABASE_NAME,

    SURVEY_COLLECTION,
    RESULT_COLLECTION,

    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DATABASE,

    REDIS_HOST,
    REDIS_PORT,
    REDIS_PWD,

    ACCESS_CONTROL_ALLOW_ORIGIN,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
    ACCESS_CONTROL_ALLOW_CREDENTIALS,

    COOKIES_SIGNED,
    COOKIES_SECRETE_KEY,

    TOKEN_EXPIRED_TIME,

    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,

} = process.env;

assert(ACCESS_LOG, "ACCESS_LOG configuration is required.");
assert(APPLICATION_LOG, "APPLICATION_LOG configuration is required.");
assert(MONGODB_URL, "MONGODB_URL configuration is required.");
assert(MONGODB_DATABASE_NAME, "MONGODB_DATABASE_NAME configuration is required.");
assert(SURVEY_COLLECTION, "SURVEY_COLLECTION configuration is required.");
assert(RESULT_COLLECTION, "RESULT_COLLECTION configuration is required.");
assert(MYSQL_HOST, "MYSQL_HOST configuration is required.");
assert(MYSQL_PORT, "MYSQL_PORT configuration is required.");
assert(MYSQL_USER, "MYSQL_USER configuration is required.");
assert(MYSQL_PWD, "MYSQL_PWD configuration is required.");
assert(MYSQL_DATABASE, "MYSQL_DATABASE configuration is required.");
assert(REDIS_HOST, "REDIS_HOST configuration is required.");
assert(REDIS_PORT, "REDIS_PORT configuration is required.");
assert(REDIS_PWD, "REDIS_PWD configuration is required.");
assert(ACCESS_CONTROL_ALLOW_ORIGIN, "ACCESS_CONTROL_ALLOW_ORIGIN configuration is required.");
assert(ACCESS_CONTROL_ALLOW_METHODS, "ACCESS_CONTROL_ALLOW_METHODS configuration is required.");
assert(ACCESS_CONTROL_ALLOW_HEADERS, "ACCESS_CONTROL_ALLOW_HEADERS configuration is required.");
assert(ACCESS_CONTROL_ALLOW_CREDENTIALS, "ACCESS_CONTROL_ALLOW_CREDENTIALS configuration is required.");
assert(COOKIES_SIGNED, "COOKIES_SIGNED configuration is required.");
assert(COOKIES_SECRETE_KEY, "COOKIES_SECRETE_KEY configuration is required.");
assert(TOKEN_EXPIRED_TIME, "TOKEN_EXPIRED_TIME configuration is required.");

assert(SMTP_HOST,"SMTP_HOST configuration is required.");
assert(SMTP_PORT,"SMTP_PORT configuration is required.");
assert(SMTP_SECURE,"SMTP_SECURE configuration is required.");
assert(SMTP_USER,"SMTP_USER configuration is required.");
assert(SMTP_PASS,"SMTP_USER configuration is required.");

module.exports = {
    accessLog: ACCESS_LOG,
    applicationLog: APPLICATION_LOG,
    mongoDB: MONGODB_URL,
    MONGODB_dbname: MONGODB_DATABASE_NAME,

    surveyCollections: {
        survey: SURVEY_COLLECTION,
        result: RESULT_COLLECTION,
    },

    MYSQL_host: MYSQL_HOST,
    MYSQL_port: MYSQL_PORT,
    MYSQL_user: MYSQL_USER,
    MYSQL_password: MYSQL_PWD,
    MYSQL_database: MYSQL_DATABASE,

    REDIS_host: REDIS_HOST,
    REDIS_port: REDIS_PORT,
    REDIS_pass: REDIS_PWD,

    access_control_allow: {
        origin: ACCESS_CONTROL_ALLOW_ORIGIN,
        methods: ACCESS_CONTROL_ALLOW_METHODS,
        headers: ACCESS_CONTROL_ALLOW_HEADERS,
        credentials: ACCESS_CONTROL_ALLOW_CREDENTIALS,
    },

    cookies: {
        signed: COOKIES_SIGNED,
        secreteKey: COOKIES_SECRETE_KEY,
    },

    tokenExpiredTime: TOKEN_EXPIRED_TIME,
    
    SMTP_HOST: SMTP_HOST,
    SMTP_PORT: Number(SMTP_PORT),
    SMTP_SECURE: SMTP_SECURE === 'true',
    SMTP_CREDENTIAL: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },

};