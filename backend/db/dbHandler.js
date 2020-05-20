const mongodb = require('mongodb').MongoClient;
const assert = require('assert').strict;

const dbUrl = 'mongodb://localhost:27017';

// todo: add auth
const username = "";
const password = "";

let db = null;

getDB = () => {
    return db;
}

setDB = (_db) => {
    db = _db;
}

/*
 *  Handles queries to DB
 * 
 *  TODO: Handle bad data
 *  TODO: Handle exceptions and errors
 */
class dbCollection {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
    }

    /*
     *  find : JSON
     *
     *  returns found rows
     */
    get = (find) => {
        return this.collection.find(find).toArray();
    }


    /*
     *  data : JSON
     *
     *  returns num of inserted rows
     */
    insert = (data) => {

        if (Array.isArray(data)) {
            
            return this.collection.insertMany(data);

        } else {

            return this.collection.insertOne(data);

        }

    }

    /*
     *  find : JSON
     *  data : JSON
     *  createIfNotExists : boolean
     *
     *  returns num of updated rows
     */
    update = (find, data, createIfNotExists) => {

    }


    /*
     *  find : JSON
     *
     *  returns num of deleted rows
     */
    delete = (find) => {

        return this.collection.deleteOne( find );

    }

}


module.exports = {
    dbCollection: dbCollection,
    setDB: setDB,
    getDB: getDB
}