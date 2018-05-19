const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const {ensureAuthenticated} = require('../helpers/auth');

// Index Route
router.get('/', (req, res) => {
    logger.GET('/ ');
    if(req.user){
        res.redirect('/dashboard');
    }
    else{
        res.redirect('/users/login');
    }
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    logger.GET('/dashboard');
    res.render('index/dashboard',{
        header: true
    });
});

module.exports = router;