const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Login Route
router.get('/login', (req, res) => {
    // logger.color('blue').log('[GET]  /user/login ');
    logger.GET('/users/login');
    res.render('users/login');
});

// Process Login Form
router.post('/login', (req, res, next) => {
    logger.POST('/users/login');
    // console.log(req.body);
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// Register Route
router.get('/register', (req, res) => {
    logger.GET('/users/register');
    res.render('users/register');
});

// Process Register Form
router.post('/register', (req, res) => {
    logger.POST('/users/register');
    console.log(req.body);

    let errors = [];
    
    // if(req.body.registerPassword.length < 4){
    //     errors.push({text: 'Password must be atleast 4 characters'});
    // }

    if(errors.length > 0){
        res.render('users/register');
    }
    else{
        User.findOne({$or: [
            { email : req.body.registerEmail },
            { username: req.body.registerUsername }
        ]}).then(user => {
            if(user){
                if(user.email == req.body.registerEmail){
                    req.flash('reg_err_msg', 'Email Already exists');
                }
                else if(user.username == req.body.registerUsername){
                    req.flash('reg_err_msg', 'Username Already exists');
                }
                let tempErrors = req.flash('reg_err_msg');
                for(var i = 0; i < tempErrors.length; i++){
                    errors.push({text: tempErrors[i]});
                }
                // console.log(tempErrors);
                res.render('users/register',{
                    errors: errors,
                    firstName: req.body.registerFirstname,
                    lastName: req.body.registerLastname,
                    username: req.body.registerUsername,
                    email: req.body.registerEmail,
                });
            }
            else{
                const newUser = new User({
                    firstName: req.body.registerFirstname,
                    lastName: req.body.registerLastname,
                    username: req.body.registerUsername,
                    email: req.body.registerEmail,
                    role: req.body.registerRole,
                    password: req.body.registerPassword,
                });

                if(newUser.role == 'student'){
                    newUser.statusVerified = true;
                }
                else{
                    newUser.statusVerified = false;
                }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                // res.send('You are now registered');
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                    })
                });
            }
        })
    }

    // res.send('register');
});

// Logout User
router.get('/logout', (req, res) => {
    logger.DEBUG(req.user.username + ' logged out');
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;