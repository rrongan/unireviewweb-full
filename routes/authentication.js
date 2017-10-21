/*
* Manage session and authentication https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/
* */

var Student = require('../models/student');
var express = require('express');
var router = express.Router();

router.login = function(req, res) {
    sess = req.session;
    Student.findOne({"username" : req.body.username }, function(err,student) {
        if (err)
            res.send(err);
            student.comparePassword(req.body.password, function(err, isMatch) {
                if (err)
                    res.send(err);
                if(isMatch){
                    sess.username = req.body.username;
                    res.end('success');
                }else{
                    res.json({ message: 'Invalid Username or Password!'});
                }
            });
    });
};

router.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
};


module.exports = router;
