const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const db = require('./db/dbHandler.js');
const auth = require('./authentication.js');

const emailValidator = require('email-validator');

// file is loaded after mongo is connected so this works
let moduleCollection = new db.dbCollection("modules");
let userCollection = new db.dbCollection("users");

// Data validation is done in dbHandler not here.
// (well, its not implemented yet but..)

const moduleCallbacks = {
    get: (req, res) => {

        // get the sessionKey to authorize user later. return false in case of no auth key
        if (!req.header.authorization) return false;
        const sessionKey = req.header.authorization.split(' ')[1];
        if (!sessionKey) return false;

        if (req.params.id) {
            auth.authorizeUser(sessionKey, req.params.id).then( (response) => {

                moduleCollection.get({ _id: new ObjectID(req.params.id) }, true).then( (data) => {

                    if (data === null) {
                        res.status(404).send("modules_not_found");
                        return;
                    }

                    // user is authorized and data was found => send
                    res.send(data);
                });

            }).catch( (error) => {
                res.status(403).send("auth_failed");
            })
        } else {
            const find = req.query;

            moduleCollection.get( find ).then( (data) => {

                auth.authrorizeUser(sessionKey, data).then( (response) => {

                    if (data.length < 1) {
                        res.status(404).send("modules_not_found");
                    }

                    // user is authorized and data was found => send
                    res.send(data);
                }).catch( (error) => {
                    res.status(403).send("auth_failed");
                })
            });
        }
    },

    // TODO: check for empty body
    post: (req, res) => {
        
        const data = req.body;

        // check if data is an empty object
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            res.status(400).send("bad_data");
            return;
        }

        // get the sessionKey to authorize user later. return false in case of no auth key
        if (!req.headers.authorization) return false;
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) return false;


        userCollection.get({ sessionKey: sessionKey }, true).then( (userObject) => {

            moduleCollection.insert(data).then( (dbres) => {

                let newResources;
                // if user has existing resources
                if (userObject.resources) {
                    // append new record IDs to user's resources array
                    newResources = [...userObject.resources, dbres.insertedId];
                } else {
                    // else create the resource array
                    newResources = [dbres.insertedId];
                }

                // resources updated with upsert true
                userCollection.update({
                    _id: userObject._id,
                }, {
                    resources: newResources
                }, true).then( (response) => {

                    res.status(200).send("modules_created");
                })
            });         
        });

    },

    put: (req, res) => {

        if (req.params.id == undefined) {
            res.sendStatus(400);
            return;
        }

        const find = { _id: new ObjectID(req.params.id) };
        const data = req.body;
        moduleCollection.update(find, data, false).then ( (response) => {
            res.send("updated");
        });
    },


    // TODO: confirm deletion
    delete: (req, res) => {
        if (req.params.id === undefined) {
            res.send("No ID defined");
        }

        const find = { _id: new ObjectID(req.params.id) };
        moduleCollection.delete(find);

        res.send("Deleted " + find._id);
    }
}

/*
 *  USER API CALL BACKS
 *  /users/
 *  GET <sessionKey> [fields]
 *  POST <email> <password>
 *  PUT <email> <password>
 */

const userCallbacks = {

    // get user data
    get: (req, res) => {
        res.send("OK");
    },

    // login
    // if login fails we send HTTP 400 'bad_credentials'
    post: (req, res) => {

        // object with email and password fields
        const userInformation = req.body;

        // check if user exists before proceeding
        userCollection.get({ email: userInformation.email }, true).then( (response) => {

            if (response === null) {
                // user (email) not found
                res.status(400).send("bad_credentials");
            } else {
                const salt = response.salt;
                const iterations = response.passwordIterations;
                const passwordAttempt = userInformation.password;

                const hashAttempt = crypto.pbkdf2Sync(passwordAttempt, salt, iterations, 64, 'sha512').toString('hex');

                // password doesn't match the hash
                if ( hashAttempt !== response.passwordHash ) {
                    res.status(400).send("bad_credentials");
                    return;
                }

                // create session key to authenticate user login session
                const key = crypto.randomBytes(24).toString('hex');
                const userID = response._id;

                // add the sessionKey to user data in db with upsert option true
                userCollection.update({ _id: userID }, { sessionKey: key }, true).then( (response) => {
                    res.send({ key: key });
                });
                
            }
        });
    },

    // signup
    // TODO: field validation
    put: (req, res) => {
        const userInformation = req.body;

        /*
            Error codes to send to the client:
                email_in_use        email already exists on another account
                bad_email           email address is not actually an email address
                bad_password        password does not match the criteria
                repeat_mismatch     password does not match the repeated password
        */


        // check for valid email before any db queries
        if ( !emailValidator.validate(userInformation.email) ) {
            res.status(400).send("bad_email");
            return;
        }

        // check that email is not in use (== no db results)
        userCollection.get({ email: userInformation.email }, true).then( (response) => {
            if (response === null) {
        
                // email is OK, check for password
                if ( userInformation.password.length < 8) {
                    res.status(400).send("bad_password");
                    return;
                }
        
                // make sure password and repeated password match
                if (userInformation.password !== userInformation.repeatPassword) {
                    res.status(400).send("repeat_mismatch");
                    return;
                }

                const salt = crypto.randomBytes(32).toString('hex');
                const iterations = 1000;
                const hash = crypto.pbkdf2Sync(userInformation.password, salt, iterations, 64, 'sha512').toString('hex');

                // user information to be inserted in DB
                const user = {
                    email: userInformation.email,
                    passwordHash: hash,
                    salt: salt,
                    passwordIterations: iterations
                }

                // all checks OK -> insert user to db
                userCollection.insert( user ).then( (response) => {
                    res.status(200).send("user_created");
                });
            } else {
                res.status(400).send("email_in_use");
            }
        });
    },
}





module.exports = {
    modules: moduleCallbacks,
    users: userCallbacks
}