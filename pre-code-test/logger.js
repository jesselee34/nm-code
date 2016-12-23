'use strict'
// Moved dependency to the top.
const chalk = require('chalk');

const LEVELS = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'debug'
};

// Capitalized Logger, better convention for a constructor.
function Logger(config) {

	// Handle in case the 'new' keyword was ommited.
	if( !(this instanceof Logger) ){
		return new Logger(config);
	}

	// Added check for config so it won't bomb is not provided.
    this.root = config && config.root || 'root';
	this.data = config && config.data || {};

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
Logger.prototype = {
	...Logger.prototype,

	log(data, level) {
        this.level = level;
        this.data = data;

        const logObj = this.createLogObject();

        const message = this.format(logObj);

        this.transport(level, message);
    },

    createLogObject() {
		// removed unnecessary if statement...
		// changed let to const... it is never mutated.
     	const rootObj = { root: this.root };

		// Changed equality operatory to === ... required by NM JavaScript style guide
        const data = typeof this.data === 'string' ? { message: this.data } : this.data;

		// changed Object.assign to use object deconstruction. I think it looks nicer :)
		// also added a default for this.data to the constructor otherwise createLogObject will fail strangely if this.data is not added.
        const logObj = {
			...rootObj,
			...data,
			level: this.level || 'info'
		};

        return logObj;
    },

    format(logObj) {
		return JSON.stringify(logObj);
    },

    transport(level, message) {
        if (level == 'error') {
            console.log(chalk.red(message));
        }
        else if (level == 'warning') {
            console.log(chalk.yellow(message));
        }
        else if (level == 'debug') {
            console.log(chalk.blue(message));
        }
        else {
            //the default is info
            console.log(chalk.green(message));
        }
	}
}

module.exports = { Logger, LEVELS };
