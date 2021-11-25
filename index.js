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

app.get('/', function (req, res) {
    res.render("home.ejs");
})


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
//

/*
const exampleData = [
    {
        date: 245444323,
        timeInHours: 3,
    },
    {
        date: 664234,
        timeInHours: 2,
    }
]

exampleData.forEach(function (item) {
    Database.saveDoc(item).then(function(returnVal) {
        console.log(returnVal);
    });
})*/


console.log("Loaded main module");