/*
* Search http://fusejs.io/
* Search check data type https://www.webbjocke.com/javascript-check-data-types/
* */

var Student = require('../models/student');
var express = require('express');
var Fuse = require('fuse.js');

var router = express.Router();

router.findAll = function(req, res) {
	// Use the Students model to find all donations
	Student.find(function(err, users) {
		if (err)
			res.status(400).send(err);

		res.json(users);
	});
};

router.findOne = function(req, res) {

	// Use the Students model to find a single user
	Student.find({ '_id' : req.params.id },function(err, user) {
		if (err)
			res.status(404).json({ message: 'Student NOT Found!', errmsg : err } );
		else
			res.json(user);
	});
};

router.addStudent = function(req, res) {

	var student = new Student();

	student.username = req.body.username;
	student.password = req.body.password;
	student.studentid = req.body.studentid;
	student.name = req.body.name;
	student.email = req.body.email;
	student.dob = req.body.dob;
	student.gender = req.body.gender;
	student.address = req.body.address;
	if(req.body.college) {
		student.college.name = req.body.college.name;
		student.college.course.name = req.body.college.course.name;
		student.college.course.year = req.body.college.course.year;
	}

	// Save the donation and check for errors
	student.save(function(err) {
		if (err)
			res.status(400).send(err);
		else
			res.status(201).json({ message: 'Student Added!', data: student });
	});
};

router.deleteStudent = function(req, res) {
	Student.findByIdAndRemove(req.params.id, function(err) {
		if (err)
			res.status(404).json({ message: 'Student Not Found!', errmsg : err});
		else
			res.json({ message: 'Student Deleted!'});
	});
};

router.editStudent = function(req, res) {

	var edit_student = Student;

	//{"dob":"1995-08-23","name":"Yun Shen Tan","studentid":20065126,"email":"rrongan@gmail.com","username":"yunshen","password":"yunshen95","college":{"name":"Waterford Institute of Technology","course":{"year":4,"name":"BSc (H) in Software System Development"}}}

	edit_student.findById(req.params.id, function(err,student) {
		if (err)
			res.status(404).json({ message: 'Student NOT Found!', errmsg : err});
		else {
			try {
				student.password = undefined;
				student.studentid = req.body.studentid || student.studentid;
				student.name = req.body.name || student.name;
				student.dob = req.body.dob || student.dob;
				student.gender = req.body.gender || student.gender;
				student.address = req.body.address || student.address;
				if(req.body.college) {
					student.college.name = req.body.college.name || student.college.name;
					student.college.course.name = req.body.college.course.name || student.college.course.name;
					student.college.course.year = req.body.college.course.year || student.college.course.year;
				}
				if(req.body.email)
					student.email = req.body.email;
				if(req.body.username)
					student.username = req.body.username;
			}catch (e){
				res.send('Edit Student Error: ',e);
			}
			Student.update({_id:req.params.id},student,function (err) {
				if (err)
					res.status(400).send(err);
				else
					res.json({ message: 'Student Updated!', data: student });
			});
		}
	});
};

router.editStudentPassword = function(req, res) {

	var edit_student_pass = Student;

	//{"oldpassword":"test","reenterpassword":"test","newpassword":"test123"}

	edit_student_pass.findById(req.params.id, function(err,student) {
		if (err)
			res.status(404).json({ message: 'Student NOT Found!', errmsg : err});
		else {
			try {
				if(req.body.oldpassword === req.body.reenterpassword) {
					student.comparePassword(req.body.oldpassword, function(err, isMatch){
						if (err)
							res.status(400).json({Error:err.message});
						else{
							if(isMatch){
								Student.update({_id:req.params.id},{password:req.body.newpassword},function (err) {
									if (err)
										res.status(400).send(err);
									else
										res.json({ message: 'Student Password Updated!'});
								});
							}else{
								res.status(400).json({ message: 'Incorrect Password!'});
							}
						}
					});
				}else{
					res.status(400).json({ message: 'Password Not Match With Re-enter Password, Please Try Again!'});
				}
			}catch (e){
				res.send('Edit Student Password Error: ',e);
			}
		}
	});
};

router.search = function(req, res) {

	//{"key":["name","college.name"],"value":"Waterford"}

	Student.find().lean().exec(function(err, users) {
		if (err)
			res.status(400).send(err);

		var students = users;
		var key = [];

		if(req.body.key){
			if(typeof req.body.key === 'object' && req.body.key.constructor === Array) {
				key = req.body.key;
			}else{
				key.push(req.body.key);
			}
		}
		var options = {
			keys: key
		};

		var fuse = new Fuse(students,options);
		var result = fuse.search(req.body.value);

		if(result.length > 0){
			return res.json(result);
		}else{
			res.status(404).json({ message: 'Result Not Found!'});
		}
	});
};

module.exports = router;