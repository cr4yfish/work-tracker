'use strict'

console.log("Loading main module..");

const express = require('express');
const app = express();
const Database = require("./database");
const path = require("path")

// CORS setup

    const cors = require("cors");
    var corsOptions = {
        origin: "*"
    }
    app.use(cors(corsOptions));

//

// POST request setup
    app.use(express.urlencoded({
        extended: false
    }))

    app.use(express.json());

//

// Port setup
    const _PORT = 30002;

    app.listen(_PORT);
//


// expose public folder

app.use(express.static(path.join(__dirname, "/public")));

//

// Public entry points

    app.get('/', function (req, res) {
        res.render("home.ejs");
    })

//

// APIs

    app.get("/api/getData", (req, res) => {
        console.log("=== Get data request: ===");
        Database.getAll().then(function (data) {
            res.send(data);
            console.log("==== DONE ====")
        })
    })

    app.post("/api/saveData", (req,res) => {
        console.log("=== Save data request: ===");
        Database.saveDoc(req.body)
        .then(function (databaseRes) {
            console.log("Saved in database:",databaseRes);
            res.send(databaseRes);
            console.log("==== DONE ====")
        })
    })

    app.post("/api/updateEntry", (req,res) => {
        console.log("=== Update Entry request ===");
        Database.updateEntry(req.body)
        .then(function (data) {
            console.log("Updated entry:", data);
            res.send(data);
            console.log("==== DONE ====")
        })
        
    })
//


// make a new entry each day
const cron = require("node-cron");
let runEveryDayTask = cron.schedule("* 0 * * *", () => {
    // code runs every day at 0am
    console.log("=== STORING NEW TEMPLATE === ");
    const templateBody = {
        date: new Date().getTime(),
        time: 0,
    }
    Database.saveDoc(templateBody)
    .then(function (data) {
        console.log("Saved in database:", data);
        console.log("==== DONE ====");
    })
});

console.log("Loaded main module. Listening on", _PORT);