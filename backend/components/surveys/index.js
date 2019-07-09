const express = require('express');
const winston = require('../../commons/logger');
const logger = winston.logger;
const router = express.Router();
const surveyDAL = require('./surveyDAL');

router.use(function(req, res, next){
    logger.info('calling survey api');
    next();
});

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


    next();
});

router.get('/questions/:name', async function(req, res) {
    
    var model = new surveyDAL();
    console.log(req.params);
    if( !req.params.name ) {
        res.status(200).json({
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

module.exports = router;