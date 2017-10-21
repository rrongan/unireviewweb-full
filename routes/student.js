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

router.findOne = function(req, res) {

    // Use the Students model to find a single user
    Student.find({ "_id" : req.params.id },function(err, user) {
        if (err)
            res.json({ message: 'Student NOT Found!', errmsg : err } );
        else
            res.json(user);
    });
}

router.addStudent = function(req, res) {

    var student = new Student();

    student.username = req.body.username;
    student.password = req.body.password;
    student.studentid = req.body.studentid;
    student.name = req.body.name;
    student.email = req.body.email;
    student.dob = req.body.dob;
    student.college.name = req.body.college.name;
    student.college.course.name = req.body.college.course.name;
    student.college.course.year = req.body.college.course.year;

    console.log('Adding student: ' + JSON.stringify(student));

    // Save the donation and check for errors
    student.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Student Added!', data: student });
    });
}

router.deleteStudent = function(req, res) {
    var del_student = new Student();
    Student.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Student Deleted!'});
    });
}

router.editStudent = function(req, res) {

    var edit_student = Student;

    //{"dob":"1995-08-23","name":"Yun Shen Tan","studentid":20065126,"email":"rrongan@gmail.com","username":"yunshen","password":"yunshen95","college":{"name":"Waterford Institute of Technology","course":{"year":4,"name":"BSc (H) in Software System Development"}}}

    edit_student.findById(req.params.id, function(err,student) {
        if (err)
            res.send(err);
        else {
            try {
                student.username = req.body.username || student.username;
                student.studentid = req.body.studentid || student.studentid;
                student.name = req.body.name || student.name;
                student.email = req.body.email || student.email;
                student.dob = req.body.dob || student.dob;
                student.gender = req.body.gender || student.gender;
                student.address = req.body.address || student.address;
                student.college.name = req.body.college.name || student.college.name;
                student.college.course.name = req.body.college.course.name || student.college.course.name;
                student.college.course.year = req.body.college.course.year || student.college.course.year;
            }catch (e){
                console.log("Edit Student Error: ",e)
            }
            student.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Student Updated!', data: student });
            });
        }
    });
}

module.exports = router;