// Require essential packages
const logger = require('node-color-log');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// Load routes
const index = require('./routes/index');
const users = require('./routes/users');

// Create app
const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/users', users);

// Default Route
app.use((req,res) => {
    res.sendStatus(404);
});

// PORT
const port = process.env.PORT || 5000;

// Start the Server
app.listen(port, () => {
    // logger.info(`Server started on port: ${port}`);
    logger.color('blue').bgColor('white').bold().underscore().reverse().log(`Server started on port: ${port}`);
});