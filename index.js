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

    .use(express.json());

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
        Database.getAll().then(function (data) {
            console.log(data);
            res.send(data);
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