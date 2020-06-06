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
        
    },

    // login
    post: (req, res) => {

    },

    // signup
    put: (req, res) => {

    },
}


module.exports = {
    modules: moduleCallbacks,
    users: userCallbacks
}