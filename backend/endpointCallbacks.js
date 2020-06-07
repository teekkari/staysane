const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const db = require('./db/dbHandler.js');

const emailValidator = require('email-validator');

// file is loaded after mongo is connected so this works
let moduleCollection = new db.dbCollection("modules");
let userCollection = new db.dbCollection("users");

// Data validation is done in dbHandler not here.
// (well, its not implemented yet but..)

const moduleCallbacks = {
    get: (req, res) => {

        if (req.params.id) {
            moduleCollection.get({ _id: new ObjectID(req.params.id) }).then( (data) => {
                res.send(data);
            })
        } else {
            const find = req.query;

            moduleCollection.get( find ).then( (data) => {
                res.send(data);
            });
        }
    },

    // TODO: check for empty body
    post: (req, res) => {
        const data = req.body;

        moduleCollection.insert(data);
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
 *  USER CALL BACKS
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

        userCollection.get({ email: userInformation.email }, true).then( (response) => {

            if (response === null) {
                res.status(400).send("bad_credentials");
            } else {

                console.log(response);

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

        console.log(userInformation);

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

                const user = {
                    email: userInformation.email,
                    passwordHash: hash,
                    salt: salt,
                    passwordIterations: iterations
                }

                // all checks OK -> insert user to db
                userCollection.insert( user ).then( (response) => {
                    //console.log(response);
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