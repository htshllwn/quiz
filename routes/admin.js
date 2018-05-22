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

// Verify Teacher
router.get('/teachers/verify', ensureAdmin, (req, res) => {
    logger.GET('/admin/teachers/verify');
    
    User.find({
        $and: [{role: 'teacher'},
                {statusVerified: false}
                ],
    }).then( (teachers) => {
        // console.log(teachers)
        res.render('admin/verifyTeacher',{
            header: true,
            pageHeader: 'Verify Teacher',
            breadcrumbTitle: 'Verify Teacher',
            teachers: teachers
        });
        
    }).catch( err => {
        console.log(err);
        res.sendStatus(404);
    });
});

// Process Verify Teacher
router.post('/teachers/verify/:id', ensureAdmin, (req, res) => {
    // console.log(req.params.id);
    User.findById(req.params.id)
        .then(teacher => {
            teacher.statusVerified = true;
            teacher.save()
                .then(teacher => {
                    // Notification of verifying user

                    res.redirect('/admin/teachers/verify');
                });
        })
        .catch(err => {
            res.sendStatus(403); 
        });
})

module.exports = router;