// Require essential packages
const logger = require('node-color-log');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

// Load routes
const index = require('./routes/index');

// Create app
const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);

// PORT
const port = process.env.PORT || 5000;

// Start the Server
app.listen(port, () => {
    // logger.info(`Server started on port: ${port}`);
    logger.color('blue').bgColor('white').bold().underscore().reverse().log(`Server started on port: ${port}`);
});