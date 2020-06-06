const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const db = require('./db/dbHandler.js');

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


const userCallbacks = {

    // get user data
    get: (req, res) => {
        res.send("OK");
    },

    // login
    post: (req, res) => {

        // object with email and password fields
        const userInformation = req.body;

        userCollection.get(userInformation, true).then( (response) => {

            // empty array => no user with creds found
            if (response.length === null) {
                res.sendStatus(400);
            } else {
                // create session key to authenticate user login session
                const key = crypto.randomBytes(24).toString('hex');
                const userID = response._id

                // add the sessionKey to user data in db with upsert option true
                userCollection.update({ _id: userID }, { sessionKey: key }, true).then( (response) => {
                    res.send({ key: key});
                });
                
            }
        });
    },

    // signup
    put: (req, res) => {
        res.send("OK");
    },
}


module.exports = {
    modules: moduleCallbacks,
    users: userCallbacks
}