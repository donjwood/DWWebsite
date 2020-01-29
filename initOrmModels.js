const UserModel = require('./models/user');
const Sequelize = require('sequelize');
const config = require('./config');


var sequelize = null;

// Use dialect setting to determin what kind of database we are working with.
if (config.db.dialect == 'postgres') {

    // Initialize for PostgreSQL
    sequelize = new Sequelize(config.db.postgresUrl, {
        dialect: "postgres",
        protocol: "postgres",
        port: 5432,
        host: "donwood",
        logging: true //false
    });

} else {

    // Intialize for SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: config.db.sqliteFile
    });

}

const User = UserModel(sequelize, Sequelize);

sequelize.sync()
    .then(() => {
        console.log(`Database & tables created!`)
})

//See if we hav an admin user. If not create it.
User.count({ where: { userName: 'admin' } }).then(count => {
    if (count == 0) {
        User.create({  
            firstName: 'Admin',
            lastName: 'User',
            userName: 'admin',
            password: 'admin',
            isAdmin: true
        })
        .then(newUser => {
            console.log(`New user ${newUser.userName} has been created.`);
        });
    }
});

module.exports = {
    User
}