const _ = require('lodash');
require('dotenv').config();

const env = process.env.NODE_ENV || "development";

/**
 * Config for all environments.
 */
const all = {
    db: {
        sqliteFile: './db/rpidb.sqlite'
    },
    bcrypt: {
        saltRounds: 10
    },
    session: {
        secret: process.env.EXP_SESSION_SECRET || 'SessionSecret',
        sqliteFileName: 'session.sqlite3',
        sqliteDirectory: 'db'
    },
    apiToken: {
        secret: process.env.API_TOKEN_SECRET || 'TokenSecret',
        options: {
            expiresIn: '24h'
        }
    }
}

/**
 * Special config for develpment.
 */
const development = {
    app: {
        port: 3000
    }
};

/**
 * Special config for production
 */
const production = {
    app: {
        port: 3000
    }
};

const config = {
    development,
    production
}

module.exports = _.merge(all, config[env]);