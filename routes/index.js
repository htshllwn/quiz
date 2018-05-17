const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');

router.get('/', (req, res) => {
    logger.GET('/ ');
    res.render('users/login');
});

module.exports = router;