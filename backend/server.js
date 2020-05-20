const mongodb = require('mongodb').MongoClient;
const assert = require('assert').strict;
const express = require('express');
const dbHandler = require('./db/dbHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const port = 5000;

const dbUrl = 'mongodb://localhost:27017';


// TODO: create request logging middleware and app.use() that shit


/*

    DB structure idea:
        Users
            what modules user has
            user id
            user email
            user password (salted hashed)

        BasicModules
            preset modules.. idea is to reuse them

        CustomModules
            modules the users have wanted to customize (title, body etc)

        AdvancedModules (concept..)
            modules with more advanced content (nothing concrete yet, just an idea)




*/


mongodb.connect(dbUrl, (err, _db) => {
    assert.equal(err, null);

    dbHandler.setDB(_db.db('staysane'));

    /* 
    * MODULES ("Cards")
    *
    * GET       /modules/[id]               list all modules or specific
    * POST      /modules/                   create module
    * PUT       /modules/                   update or create module
    * DELETE    /modules/<id>               delete module
    *  
    */  


    const modules = require('./endpointCallbacks.js').modules;

    app.route("/modules/:id?")
        .get(modules.get)
        .post(modules.post)
        .put(modules.put)
        .delete(modules.delete);


    app.listen(port, () => console.log(`Listening on port ${port}`) );
});

