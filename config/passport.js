const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../helpers/logger');

// Load User Model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({
            usernameField: 'loginUsername',
            passwordField: 'loginPassword'
        }, (username, password, done) => {
        // Match User
        // logger.DEBUG(username + ' | ' + password);
        User.findOne({
            username: username
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'No User Found'});
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    logger.DEBUG(user.username + ' logged in');
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Password Incorrect'});
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}