const express = require('express');
const router = express.Router();
const logger = require('node-color-log');

router.get('/', (req, res) => {
    logger.color('blue').log('Requested / ');
    res.render('index/home');
});

module.exports = router;