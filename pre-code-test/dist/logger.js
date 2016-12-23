'use strict';
// Moved dependency to the top.

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var chalk = require('chalk');

var LEVELS = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'debug'
};

// Capitalized Logger, better convention for a constructor.
function Logger(config) {

    // Handle in case the 'new' keyword was ommited.
    if (!(this instanceof Logger)) {
        return new Logger(config);
    }

    this.root = config.root || 'root';
    this.data = config.data || {};

    // Handle in case config was not provided.
    if (config && config.format) {
        this.format = config.format;
    }

    // Handle in case config was not provided.
    if (config && config.transport) {
        this.transport = config.transport;
    }
}

// Mixed back in original prototype properties and methods fixing ambiguous constructor etc.
Logger.prototype = _extends({}, Logger.prototype, {
    log: function log(data, level) {
        this.level = level;
        this.data = data;

        var logObj = this.createLogObject();

        var message = this.format(logObj);

        this.transport(level, message);
    },
    createLogObject: function createLogObject() {
        // removed unnecessary if statement...
        // changed let to const... it is never mutated.
        var rootObj = { root: this.root };

        // Changed equality operatory to === ... required by NM JavaScript style guide
        var data = typeof this.data === 'string' ? { message: this.data } : this.data;

        // changed Object.assign to use object deconstruction. I think it looks nicer :)
        // also added a default for this.data to the constructor otherwise createLogObject will fail strangely if this.data is not added.
        var logObj = _extends({}, rootObj, data, {
            level: this.level || 'info'
        });

        return logObj;
    },
    format: function format(logObj) {
        return JSON.stringify(logObj);
    },
    transport: function transport(level, message) {
        if (level == 'error') {
            console.log(chalk.red(message));
        } else if (level == 'warning') {
            console.log(chalk.yellow(message));
        } else if (level == 'debug') {
            console.log(chalk.blue(message));
        } else {
            //the default is info
            console.log(chalk.green(message));
        }
    }
});

module.exports = { Logger: Logger, LEVELS: LEVELS };