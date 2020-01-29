const _ = require('lodash');
require('dotenv').config();

const env = process.env.NODE_ENV || "development";

/**
 * Config for all environments.
 */
const all = {
    bcrypt: {
        saltRounds: 10
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
    db: {
        dialect: 'sqlite',
        sqliteFile: './db/DWWebsite.sqlite'
    },
    session: {
        secret: process.env.EXP_SESSION_SECRET || 'SessionSecret',
        db: {
            dialect: 'sqlite',
            sqliteFileName: 'session.sqlite3',
            sqliteDirectory: 'db'
        }
    },
    app: {
        avar: 'aval'
    }
};

/**
 * Special config for production
 */
const production = {
    db: {
        dialect: 'postgres',
        postgresUrl: process.env.DATABASE_URL
    },
    session: {
        secret: process.env.EXP_SESSION_SECRET || 'SessionSecret',
        db: {
            dialect: 'postgres'
        }
    },
    app: {
        avar: 'aval'
    }
};

const config = {
    development,
    production
}

module.exports = _.merge(all, config[env]);