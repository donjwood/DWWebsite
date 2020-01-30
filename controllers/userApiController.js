const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../initOrmModels');
const jwt = require('jsonwebtoken');

const config = require('../config');

exports.getToken = async function (req, res, next) {

    //Check that the username and password are not undefined
    if (req.body.userName == undefined ||
        req.body.password == undefined) {
        res.json({
            authenticated: false
        });
    }

    try {

        //Authenticate the user
        let user = await User.authenticate(req.body.userName, req.body.password);
        if (user != undefined) {

            //Remove password and put user into jwt.
            user.password = '';

            let payload = {
                user: user
            };
            let token = jwt.sign(payload, config.apiToken.secret, config.apiToken.options);
            res.json({
                authenticated: true,
                user: user,
                token: token
            });
        } else {
            res.json({
                authenticated: false,
            });
        }
    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    } 
}

exports.getAllUsers = async function (req, res, next) {

    try {
    
        let userList = await User.findAll();
        
        var clientUserList = [];

        //Loop through all users and return the client version of them.
        for (var i = 0; i < userList.length; i++) {
            userList[i].password = '';
            clientUserList.push(userList[i]);
        }

        //Send response.
        res.json({
            userList: clientUserList
        });

    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    } 

}

exports.getUser = async function (req, res, next) {

    //Get the user ID
    var userId = req.params.userId;

    try {

        //Get the user
        let user = await User.findByPk(userId);

         user.password = '';
         res.json({
             user: user
         });

    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    } 

}

exports.isUserNameAvaliable = async function (req, res, next) {

    try {

        //Find matching usernames
        let matchingUsernames = await User.count({
            where: {
                userName: req.body.userName
            }
        });

        if (matchingUsernames == 0) {
            res.json({
                isUserNameAvaliable: true
            });
        } else {
            res.json({
                isUserNameAvaliable: false
            });
        }

    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    }
}

exports.isUserNameAvaliableExcludeId = async function (req, res, next) {

    //Get the user ID (current user excluded). 
    var userId = req.params.userId;

    try {

        //Find matching usernames
        let matchingUsernames = await User.count({
            where: {
                id: {
                    [Op.ne]: userId
                },
                userName: req.body.userName
            }
        });

        if (matchingUsernames == 0) {
            res.json({
                isUserNameAvaliable: true
            });
        } else {
            res.json({
                isUserNameAvaliable: false
            });
        }

    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    }
}

exports.verifyPassword = async function (req, res, next) {

    //Get the user ID
    var userId = req.params.userId;

    try {

        //Get the user
        let user = await User.findByPk(userId);

        //Verify the current password
        let isPasswordVerified = await user.verifyPassword(req.body.password);

        res.json({
            isPasswordVerified: isPasswordVerified
        });

    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    }
}

exports.createUser = async function (req, res, next) {
    
    try {
        var newUser = await User.create({  
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        });
        newUser.password = '';
        res.json(newUser);
    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    }

}

exports.updateUser = async function (req, res, next) {

    //Get the token so we can use it to check user data.
    let token = req.headers['x-access-token'];

    jwt.verify(token, config.apiToken.secret, async function(err, decoded) {
        if (!err) {
            //Get the user ID
            var userId = req.params.userId;
            try {
                //Get the user and update it.
                let user = await User.findByPk(userId);

                //Verify that the user is not trying to alter any properties that they should not.
                if (user.userName == 'admin' && 
                    req.body.userName != undefined &&
                    req.body.userName != 'admin') {
                    
                    //Cannot alter username of admin
                    res.json({
                        errorMessage: 'Cannot change username for admin user.'
                    });
                } else if (user.userName == 'admin' && 
                           req.body.isAdmin != undefined &&
                           !req.body.isAdmin) {
                    
                    //Cannot set admin user to not be an admin
                    res.json({
                        errorMessage: 'Cannot change admin user to not be an admin.'
                    });

                } else if (decoded.user.id == userId && 
                           req.body.isAdmin != undefined &&
                           decoded.user.isAdmin != req.body.isAdmin) {

                    //Cannot change isAdmin property of self.
                    res.json({
                        errorMessage: 'Cannot change admin status of current user.'
                    });

                } else {
                    //All checks passed, update the user
                    await user.update(req.body)
                    user.password = '';
                    res.json({
                        user: user
                    });
                }
            } catch(err) {
                console.log(err);
                res.json({
                    errorMessage: err
                });
            }
        } else {
            console.log(err);
            res.json({
                errorMessage: err
            });
        }
    });
}

exports.deleteUser = async function (req, res, next) {

    //Get the user ID
    var userId = req.params.userId;

    try {
        var successfullyDeleted =  await User.destroy({
            where:{
                id: userId
            }
        });

        if(successfullyDeleted) {
            res.json({
                deleted: true
            });
        } else {
            res.json({
                deleted: false
            })
        }
    } catch(err) {
        console.log(err);
        res.json({
            errorMessage: err
        });
    }

}
