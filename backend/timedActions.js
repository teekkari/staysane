const db = require('./db/dbHandler.js');
const stats = require('./statistics/statistics.js');

const users = new db.dbCollection('users');
const modules = new db.dbCollection('modules');

let interval = null;

function initializeModuleResetLoop() {
    // run the resetModules function in 5 minute intervals (5*60*1000 ms)
    interval = setInterval(resetModules, 5*60*1000)
}

function stopModuleResetLoop() {
    clearInterval(interval);
}


function resetModules() {

    const now = new Date();
    const time = parseInt( now.getUTCHours() + ( '0' + now.getUTCMinutes()).slice(-2) );

    // get users whose reset time matches [UTCNow, UTCNow + 5min) interval
    users.get({ "settings.moduleResetTime": { $gte: time, $lt: time + 5 } }, false).then( (users) => {
        for (let user of users) {
            // get user's modules from resources array
            modules.get({ _id: { $in: user.resources } }).then( (dbResponse) => {

                // TODO: save snapshot of user's completed modules for the day.
                stats.saveDailySnapshot(user._id, dbResponse);

                for (let module of dbResponse) {
                    // update user's modules to isDone: false state
                    modules.update({ _id: module._id }, { isDone: false }).then( (dbResponse) => {
                        // successfully updated module
                    }).catch( (error) => console.log(error) );
                }
                console.log("Updated modules for " + user.email);
            }).catch( (error) => console.log(error) );
        }
    }).catch( (error) => console.log(error) );
}


module.exports = {
    initializeModuleResetLoop: initializeModuleResetLoop,
    stopModuleResetLoop: stopModuleResetLoop
}