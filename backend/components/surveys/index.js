const express = require('express');
const cookieParser = require('cookie-parser');
const winston = require('../../commons/logger');
const http = require('../../commons/http');
const appConf = require('../../config/production.conf');
const auth = require('../helpers/auth');
const logger = winston.logger;
const router = express.Router();
const surveyDAL = require('./surveyDAL');

router.use(function(req, res, next){
    logger.info('calling users api ' + req.path);
    next();
});

router.use(cookieParser(appConf.cookies.secreteKey,
    {
        maxAge: 1000 * 60 * 15,         // would expire after 15 minutes
        httpOnly: true,                 // The cookie only accessible by the web server
        signed: appConf.cookies.signed  // Indicates if the cookie should be signed
    }));    

router.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    var userId, tokenId;

    if ( req.signedCookies['userid'] !== undefined && req.signedCookies['token'] !== undefined ) {
        userId = req.signedCookies['userid'];
        tokenId = req.signedCookies['token'];
        logger.info("Found token in cookies");
    } else if ( req.headers['userid'] !== undefined && req.headers['token'] !== undefined ) {
        logger.info("Not found token in cookies. Using the token on header, instead");
        userId = req.headers['userid'];
        tokenId = req.headers['token'];
    } else {
        logger.error("Not found token");
        http.error(res, 401, 401000, "Invalid token");
        return;
    }

    logger.debug('read cookies userid: ' + userId + ' token: ' + tokenId);
    
    auth.verifyToken( userId, tokenId, function (err) {
        if( err ){
            http.error(res, 401, 401000, "Invalid token");
        }else{
            req.USERID = userId;
            next();
        }
    })

});

router.get('/questions/:name', async function(req, res) {
    
    var model = new surveyDAL();
    console.log(req.params);
    if( !req.params.name ) {
        res.status(404).json({
            success: true,
            code: 404000,
            desc: "invalid uri",
            data: null })
        return;
    }
    var data = await model.getQuestions(req.params.name);
    console.log("data: " + data);
    res.status(200).json({
        success: true,
        code: 20000,
        desc: "",
        data: data })
});

router.post('/questions', async function(req, res) {
    
    var model = new surveyDAL();
    var ctx = req.body;
    console.log(ctx);
    var r = await model.setQuestions(ctx);
    res.status(200).json({
        success: r.success,
        code: 20000,
        desc: "",
        data: r.data })
});

router.get('/answers/:empid/:qid/:version', async function(req, res) {
    
    var model = new surveyDAL();
    console.log(req.params);
    if( !req.params.empid ) {
        res.status(404).json({
            success: true,
            code: 404000,
            desc: "invalid employee id",
            data: null })
        return;
    }
    if( !req.params.qid ) {
        res.status(404).json({
            success: true,
            code: 404000,
            desc: "invalid question id",
            data: null })
        return;
    }
    if( !req.params.version ) {
        res.status(404).json({
            success: true,
            code: 404000,
            desc: "invalid version",
            data: null })
        return;
    }

    var ctx = {
        employeeId:req.params.empid,
        name: req.params.qid,
        version: req.params.version
    }
    logger.debug('query parameters: ' + JSON.stringify(ctx));
    var data = await model.getAnswer(ctx);
    console.log("data: " + data);
    res.status(200).json({
        success: true,
        code: 20000,
        desc: "",
        data: data })
});

router.post('/answers', async function(req, res) {
    
    var model = new surveyDAL();
    var ctx = req.body;
    ctx.USERID = req.USERID;
    console.log(ctx);
    var r = await model.setAnswer(ctx);
    res.status(200).json({
        success: r.success,
        code: 20000,
        desc: "",
        data: r.data })
});

module.exports = router;