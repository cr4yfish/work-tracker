console.log("Loading Database...");

const Datastore = require("@seald-io/nedb");
const log = new Datastore({ filename: './database/logs.db', autoLoad: true });
log.loadDatabase();


function throwError(info) {
    console.log(`Database internal error at ${info}`);
}

// returns all entries, sorted by date like so: 31th, 30th, 29th etc.
const getAll = function() {
    return new Promise((resolve, reject) => {
        try {
            console.log("Trying to find docs...");
            log.find( {} ).sort( {date: -1}).exec(function(err, docs) {
                if(docs.length == 0) {
                    console.log("No docs found!");
                    //reject("Database empty");
                } else {
                    console.log("Returning found docs..");
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
            console.log("Trying to save doc...");
            log.insert(doc, function (err, newDoc) {
                if(err) {
                    console.log("Database error:", err);
                    throwError(err);
                    //reject(err);
                } else {
                    console.log("Returning saved doc..");
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

const updateEntry = function(entry) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Trying to update doc...");
            log.update( {_id: entry._id}, entry, {}, function (err, docsUpdated) {
                if(err) {
                    throwError(err);
                } else {
                    console.log("Returning updated doc..");
                    resolve(entry);
                    log.persistence.compactDatafile();
                }
            })
        }
        catch (e) {
            throwError(e);
        }
    })
}

exports.saveDoc = saveDoc;
exports.getAll = getAll;
exports.updateEntry = updateEntry;

console.log("Loaded Database");