const express = require('express');
const router = express.Router();
const winston = require('../../commons/logger');
const logger = winston.logger;

router.get('/:id',function(req, res) {
    res.status(200).json({ 
        id: req.params.id, 
        name: 'narongsak'
    })
});

router.get('/ab',function(req, res) {
    res.status(200).json({ name: 'narongsak2' })
});

module.exports = router;