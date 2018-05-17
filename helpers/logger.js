const logger = require('node-color-log');

module.exports = {
    GET: function(text){
        logger.color('blue').log(`[GET]  ${text} `);
    },
    POST: function(text){
        logger.color('magenta').log(`[POST] ${text} `);
    },
    DEBUG: function(text){
        logger.debug(`${text}`);
    },
    ERROR: function(text){
        logger.error(`${text}`);
    },
    INFO: function(text){
        logger.info(`${text}`);
    },
    WARN: function(text){
        logger.warn(`${text}`);
    },
    SERVER: function(text){
        logger.color('blue').bgColor('white').bold().underscore().reverse().log(text);
    },
}