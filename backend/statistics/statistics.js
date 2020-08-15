const db = require('../db/dbHandler.js');

/*
    STATISTICS DB STRUCTURE

    {
        uid         userid
        data [
            { date, stats }
            { date, stats }
        ]
    }


*/

const statistics = new db.dbCollection('statistics');

function saveDailySnapshot(userID, modules) {

    // today's "snapshot", to be appended to data array
    const stat = {
        date: new Date(),
        completed: modules.filter( m => m.isDone ).length,
        total: modules.length,
    }

    statistics.get({uid: userID }, true).then( (dbResponse) => {
        if (dbResponse === null) {
            statistics.insert({ uid: userID, data: [stat] }).catch( (error) => console.log(error) );
        } else {
            statistics.update({ uid: userID }, { data: [...dbResponse.data, stat]});
        }
    }).catch( (error) => console.log(error) );

    
}

module.exports = {
    saveDailySnapshot: saveDailySnapshot
}