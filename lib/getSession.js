const session = require("../models/session");

function getSessions(userID) {
    return new Promise((resolve, reject) => {
        session.find({}, (err, docs) => {
            for (const session of docs) {
                console.log(session);
                if (JSON.parse(session.session).userID == userID) {
                    resolve(true);
                    return;
                }
            }
             resolve(false);
             return;   
        })
    })
}

module.exports = getSessions;