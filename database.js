console.log("Loading Database...");

const Datastore = require("@seald-io/nedb");
const log = new Datastore({ filename: './database/logs.db', autoLoad: true });
log.loadDatabase();


function throwError(info) {
    console.log(`Database internal error at ${info}`);
}

const getAll = function() {
    return new Promise((resolve, reject) => {
        try {
            log.find( {}, function(err, docs) {
                if(docs.length == 0) {
                    //reject("Database empty");
                } else {
                    resolve(docs);
                }
                if(err) {
                    throwError(err);
                    //reject(err);
                }
            })
        }
        catch (e) {
            throwError(e);
            //reject(e);
        }
    })
}

const saveDoc = function(doc) {
    return new Promise((resolve, reject) => {
        try {
            log.insert(doc, function (err, newDoc) {
                if(err) {
                    console.log("Database error:", err);
                    throwError(err);
                    //reject(err);
                } else {
                    resolve(newDoc);
                }
            })
        }
        catch (e) {
            throwError(e);
            //reject(err);
        }
    })
}

exports.saveDoc = saveDoc;
exports.getAll = getAll;

console.log("Loaded Database");