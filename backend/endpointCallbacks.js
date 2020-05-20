const ObjectID = require('mongodb').ObjectID;
const db = require('./db/dbHandler.js');

// file is loaded after mongo is connected so this works
let moduleCollection = new db.dbCollection("modules");

// TODO: log information about requests to console

const moduleCallbacks = {
    get: (req, res) => {

        // TODO: get find params from req if 'id' not defined

        if (req.params.id) {
            moduleCollection.get({ _id: new ObjectID(req.params.id) }).then( (data) => {
                res.send(data);
            })
        } else {
            moduleCollection.get({}).then( (data) => {
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
        const find = { _id: req.params.id }
        const data = null;
        moduleCollection.update(find, data, null);
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


module.exports = {
    modules: moduleCallbacks
}