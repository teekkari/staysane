const db = require('./db/dbHandler.js');
const usersCollection = new db.dbCollection('users');

// @param sessionKey string hex session key
// @param resourceIDS string or array of resourceIDs
function authorizeUser(sessionKey, resourceIDs) {

    // this allows for single values to be passed in as parameters
    const resources = [ resourceIDs ].flat();

    usersCollection.get({
        sessionKey: sessionKey,
        resources: { $all: resourceIDs },
    }, true).then( (response) => {
        if (response !== null) {
            return true;
        } else {
            throw new Error("Authorization failed");
        }
    });

}

module.exports = {
    authrorizeUser: this.authrorizeUser
}