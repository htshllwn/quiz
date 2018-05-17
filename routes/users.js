const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');

// Login Route
router.get('/login', (req, res) => {
    // logger.color('blue').log('[GET]  /user/login ');
    logger.GET('/users/login');
    res.render('users/login');
});

// Register Route
router.get('/register', (req, res) => {
    logger.GET('/users/register');
    res.render('users/register');
});

// Process Register Form
router.post('/register', (req, res) => {
    logger.POST('/users/register');
    console.log(req.body)
    res.send('register');
});

module.exports = router;