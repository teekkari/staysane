const db = require('./db/dbHandler.js');

//const users = new db.dbCollection('users');
const modules = new db.dbCollection('modules');

let interval = null;

function initializeModuleResetLoop() {
    interval = setInterval(resetModules, 60*1000)
}

function stopModuleResetLoop() {
    clearInterval(interval);
}


function resetModules() {
    modules.get({}).then( (dbResponse) => {
        for (let module of dbResponse) {
            modules.update({ _id: module._id }, { isDone: false }).then( (dbResponse) => {
                console.log("module " + module.title + " updated.");
            });
        }
    }).catch( (error) => console.log(error) );
}


module.exports = {
    initializeModuleResetLoop: initializeModuleResetLoop,
    stopModuleResetLoop: stopModuleResetLoop
}