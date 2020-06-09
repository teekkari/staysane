const db = require('./db/dbHandler.js');
const usersCollection = new db.dbCollection('users');

// @param sessionKey string hex session key
// @param resourceIDS string or array of resourceIDs
// @return promise with resolves to user's document
async function authorizeUser(sessionKey, _resources) {

    // this allows for single values to be passed in as parameters
    const resources = [ _resources ].flat().map(x => x._id);

    await usersCollection.get({
        sessionKey: sessionKey,
        resources: { $all: resources },
    }, true).then( (response) => {

        if (response !== null) {
            return response;
        } else {
            throw new Error("Authorization failed");
        }
    });

}

async function verifySessionKey(sessionKey) {
    await usersCollection.get({ sessionKey: sessionKey }, true).then( response => {
        if (response !== null) return true;
        else throw new Error("Invalid session key");
    });
}

module.exports = {
    authorizeUser: authorizeUser,
    verifySessionKey: verifySessionKey
}