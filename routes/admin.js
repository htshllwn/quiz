const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const mongoose = require('mongoose');
const {
    ensureAuthenticated,
    ensureAdmin,
} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// View Teachers
router.get('/teachers', ensureAdmin, (req, res) => {
    logger.GET('/admin/teachers');

    User.find({
        role: 'teacher'
    }).then( (teachers) => {
        // console.log(teachers)
        
        res.render('admin/teachers',{
            header: true,
            pageHeader: 'Teachers',
            breadcrumbTitle: 'Teachers',
            teachers: teachers
        });
    }).catch( err => {
        console.log(err);
        res.sendStatus(404);
    });
});

// Add Teacher
router.get('/teachers/add', ensureAdmin, (req, res) => {
    logger.GET('/admin/teachers/add');
    
    res.render('admin/addTeacher',{
        header: true,
        pageHeader: 'Add teacher',
        breadcrumbTitle: 'Add Teacher'
    });
});

module.exports = router;