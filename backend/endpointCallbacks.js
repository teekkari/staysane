const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const db = require('./db/dbHandler.js');
const auth = require('./authentication.js');

const emailValidator = require('email-validator');

// DB COLLECTIONS
// file is loaded after mongo is connected so this works
const moduleCollection = new db.dbCollection("modules");
const userCollection = new db.dbCollection("users");

// Data validation is done in dbHandler not here.
// (well, its not implemented yet but..)

const moduleCallbacks = {

    // GET /modules/[id]
    get: (req, res) => {

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }

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
            
            userCollection.get({ sessionKey: sessionKey }, true).then( (userObject) => {

                if (userObject === null){
                    res.status(400).send("invalid_session");
                    return;
                }

                moduleCollection.get( {_id: { $in: userObject.resources }} ).then( (data) => {
                    res.send(data);
                });
            }).catch( (error) => {
                console.log(error);
                res.status(400).send("invalid_session");
            })
        }
    },

    // TODO: check for empty body
    // POST /modules
    post: (req, res) => {
        
        const data = req.body;
        data.isDone = false;
        data.dateDone = null;

        // check if data is an empty object
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            res.status(400).send("bad_data");
            return;
        }

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }


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

                    res.status(200).send(dbres.insertedId);
                })
            });         
        });

    },

    // PUT /modules
    put: (req, res) => {

        if (req.params.id == undefined) {
            res.sendStatus(400);
            return;
        }

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }

        const find = { _id: new ObjectID(req.params.id) };
        const data = req.body;

        auth.authorizeUser(sessionKey, find).then( (response) => {
            moduleCollection.update(find, data, false).then ( (response) => {
                res.send("update_successful");
            });
        }).catch( (error) =>{
            res.status(403).send("auth_failed");
        })
        
    },


    // TODO: confirm deletion
    delete: (req, res) => {
        if (req.params.id === undefined) {
            res.status(400).send("missing_id");
        }

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }

        const find = { _id: new ObjectID(req.params.id) };
        auth.authorizeUser(sessionKey, find).then( (isAuthorized) => {
            moduleCollection.delete(find).then( (dbResponse) => {
                res.send("deletion_success");
            }).catch( (error) => { res.status(500).send("deletion_failed"); });
        }).catch( (error) => { res.status(403).send("auth_failed"); return; });

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
    // for the time being this is used to verify valid session keys
    get: (req, res) => {

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }

        auth.verifySessionKey(sessionKey).then( (response) => {
            res.send("valid_session");
        }).catch( (error) => {
            res.status(403).send("invalid_session");
        })
    },

    // login
    // if login fails we send HTTP 400 'bad_credentials'
    post: (req, res) => {

        // object with email and password fields
        const userInformation = req.body;

        // check if user exists before proceeding
        userCollection.get({ email: userInformation.email }, true).then( (userObject) => {

            if (userObject === null) {
                // user (email) not found
                res.status(400).send("bad_credentials");
            } else {
                const salt = userObject.password.salt;
                const iterations = userObject.password.iterations;
                const passwordAttempt = userInformation.password;

                const hashAttempt = crypto.pbkdf2Sync(passwordAttempt, salt, iterations, 64, 'sha512').toString('hex');

                // password doesn't match the hash
                if ( hashAttempt !== userObject.password.hash ) {
                    res.status(400).send("bad_credentials");
                    return;
                }

                // create session key to authenticate user login session
                const sessionKey = crypto.randomBytes(24).toString('hex');
                const userID = userObject._id;

                // add the sessionKey to user data in db with upsert option true
                userCollection.update({ _id: userID }, { sessionKey: sessionKey }, true).then( (response) => {
                    res.send({ sessionKey: sessionKey });
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
                    password: {
                        hash: hash,
                        salt: salt,
                        iterations: iterations
                    },
                    resources: [],
                    settings: {}
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


const settingCallbacks = {
    get: (req, res) => {

    },

    post: (req, res) => {
        /*
            data should be an object
            {
                settingName: settingValue,
                settingName2: settingValue,
                ...
            }
        */
        const data = req.body;

        if (typeof data !== 'object' || data === null){
            res.status(400).send("invalid_data");
            return;
        }

        let settings = {};

        for (let settingName in data) {
            switch (settingName) {
                case 'moduleResetTime':
                    // check that the time is hh:mm format
                    if (data.moduleResetTime.length !== 5 && data.moduleResetTime.split(':').length !== 2) {
                        res.status(400).send("invalid_data");
                        return;
                    }

                    const time = data.moduleResetTime;
                    const offset = data.UTCOffset;
                    
                    // convert hours and minutes to UTC - could be done client side too but this is how it is now
                    const hours = parseInt(time.split(':')[0]) + Math.floor(offset / 60);
                    const minutes = parseInt(time.split(':')[1]) + (offset % 60);

                    // construct UTC HHmm as integer for easy db querying.
                    settings.moduleResetTime = parseInt( ('0' + hours).slice(-2) + ('0' + minutes).slice(-2) );
                    break;
            }
        }

        // get the sessionKey to authorize user later. send HTTP 403 in case of no auth key
        if (!req.headers.authorization) { res.status(403).send("no_authorization_header"); return false; }
        const sessionKey = req.headers.authorization.split(' ')[1];
        if (!sessionKey) { res.status(403).send("invalid_session_key"); return false; }

        userCollection.update( { sessionKey: sessionKey }, { settings: settings }, true).then( (dbResponse) => {
            res.send("settings_updated");
        }).catch( (error) => {
            res.status(500).send("settings_update_failed");
        });

    }
}





module.exports = {
    modules: moduleCallbacks,
    users: userCallbacks,
    settings: settingCallbacks,
}