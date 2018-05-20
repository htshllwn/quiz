// Require essential packages
const logger = require('./helpers/logger');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load Keys
const keys = require('./config/keys');

// HandleBars helpers
const hbsHelper = require('./helpers/hbs');

// Load Models
require('./models/User');
const User = mongoose.model('users');

// Mongoose connect
mongoose.connect(keys.mongoURI)
    .then( () => {
        logger.SERVER(`MongoDB Connected`);
        User.findOne({role: 'admin'})
            .then((user) => {
                if(user){
                    logger.INFO('Admin Present');
                }
                else{
                    const newUser = new User({
                        firstName: 'Admin',
                        lastName: 'CynQuiz',
                        username: 'admin',
                        email: 'admin@cynquiz.com',
                        role: 'admin',
                        password: keys.adminPassword,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    logger.INFO('Admin Created');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        })
                    });
                } 
            })
    })
    .catch( err => console.log(err));

// Load routes
const index = require('./routes/index');
const users = require('./routes/users');
const admin = require('./routes/admin');

// Create app
const app = express();

// Passport Config
require('./config/passport')(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        compare: hbsHelper.compare,
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passort middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// GLOBAL Variables
app.use(function(req, res, next){
    res.locals.reg_err_msg = req.flash('reg_err_msg');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);

// Default Route
app.use((req,res) => {
    res.sendStatus(404);
});

// PORT
const port = process.env.PORT || 5000;

// Start the Server
app.listen(port, () => {
    // logger.info(`Server started on port: ${port}`);
    logger.SERVER(`Server started on port: ${port}`);
});