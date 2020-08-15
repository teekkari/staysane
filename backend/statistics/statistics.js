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

    const date = new Date().toISOString().split('T')[0];

    // today's "snapshot", to be appended to data array
    const stat = {
        date: date,
        completed: modules.filter( m => m.isDone ).length,
        total: modules.length,
    }

    statistics.get({uid: userID }, true).then( (dbResponse) => {

        // no existing data => insert initial
        if (dbResponse === null) {
            statistics.insert({ uid: userID, data: [stat] }).catch( (error) => console.log(error) );
        } else {
            
            const latestDate = dbResponse.data[dbResponse.data.length - 1].date;
           
            // if dates dont match, insert data, else replace latest
            if (date !== latestDate) {
                statistics.update({ uid: userID }, { data: [...dbResponse.data, stat]});
            } else {
                statistics.update({ uid: userID }, { data: [...dbResponse.data.slice(0, -1), stat]});
            }
        }
    }).catch( (error) => console.log(error) );

    
}

module.exports = {
    saveDailySnapshot: saveDailySnapshot
}