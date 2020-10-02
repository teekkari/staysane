const mongodb = require('mongodb').MongoClient;
const assert = require('assert').strict;
const express = require('express');
const cors = require('cors');
const dbHandler = require('./db/dbHandler');

const app = express();

// TODO: configure CORS options
const corsOptions = {};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded());

const port = 5100;

const dbUrl = 'mongodb://localhost:27017';


// TODO: create request logging middleware and app.use() that shit


/*

    DB structure idea:
        Users
            what modules user has (array of ids)
            user id
            user email
            user password (salted hashed)
            user key (stored in client cookies and used for authorization)
            user key expiration

        Modules
            id
            title
            body

*/


mongodb.connect(dbUrl, { useUnifiedTopology: true }, (err, _db) => {
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


    /* 
    * MODULES ("Cards")
    *
    * GET       /users/[key]                get user information
    * POST      /users/                     login
    * PUT       /users/                     signup
    */  

    const users = require('./endpointCallbacks.js').users;
    app.route("/users/:key?")
        .get(users.get)
        .post(users.post)
        .put(users.put);

    /*
    * SETTINGS
    *
    * GET       /settings/[settingName]     get settingValue(s) in an object { name: value }
    * POST      /settings                   update setting values (data in object { name: value })
    */

    const settings = require('./endpointCallbacks.js').settings;
    app.route("/settings/:settingName?")
        .get(settings.get)
        .post(settings.post);


    /*
    * STATS
    * 
    * GET       /stats/[amount]             gets stats for user
    * 
    *
    */

    const stats = require('./endpointCallbacks.js').stats;
    app.route("/stats/:amount?")
        .get(stats.get);


    const timers = require('./timedActions.js');
    timers.initializeModuleResetLoop();
    

    app.listen(port, () => console.log(`Listening on port ${port}`) );
});

