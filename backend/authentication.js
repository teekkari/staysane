const db = require('./db/dbHandler.js');
const usersCollection = db.dbCollection('users');

// re
function authorizeUser(sessionKey, resourceID) {

    usersCollection.get({
        sessionKey: sessionKey,
        resources: { $elemMatch: resourceID },
    }, true).then( (response) => {
        if (response !== null) {
            return true;
        } else {
            return false;
        }
    });

}

module.exports = {
    authrorizeUser: this.authrorizeUser
}