var Student = require('../models/student');
var express = require('express');

var mongoose = require('mongoose');

var router = express.Router();

mongoose.connect('mongodb://localhost:27017/unireviewdb');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});

//added this in the hope of being able to interface from the command line
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

router.findAll = function(req, res) {
    // Use the Students model to find all donations
    Student.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
}


module.exports = router;