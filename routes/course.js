var College = require('../models/college');
var Course = require('../models/course').model;
var express = require('express');
var Fuse = require('fuse.js');

var router = express.Router();

router.addCollegeCourse = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			var course = new Course();
			var array = [];
			var check = true;

			course.name = req.body.name;
			course.courseid = req.body.courseid;
			course.description = req.body.description;
			course.courseleader = req.body.courseleader;

			if (course.courseid) {
				for(var i=0;i<college[0].course.length;i++){
					if(college[0].course[i].courseid === course.courseid){
						res.status(400).json({message: 'Course Code Is Already Exists!'});
						check = false;
						break;
					}
				}
				if(check) {
					if (Array.isArray(college[0].course)) {
						college[0].course.push(course);
					} else {
						array.push(course);
						college[0].course = array;
					}
					College.update({_id: req.params.id}, college[0], function (err) {
						if (err)
							res.status(400).send(err);
						else
							res.json({message: 'Added Course To College Profile!', data: course});
					});
				}
			} else {
				res.status(400).json({message: 'Failed to Add Course To College Profile!'});
			}
		}
	});
};

router.findAllCollegeCourse = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			res.json(college[0].course);
		}
	});
};

router.findOneCollegeCourse = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college[0].course.length>0) {
				for (var i = 0; i < college[0].course.length; i++) {
					if (college[0].course[i]._id == req.params.cid) {
						res.json(college[0].course[i]);
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

router.editCollegeCourse = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college[0].course.length < 1){
				res.status(404).json({message: 'Course NOT Found!'});
			}else {
				for (var i = 0; i < college[0].course.length; i++) {
					if (college[0].course[i]._id == req.params.cid) {
						var course = college[0].course[i];

						course.name = req.body.name || course.name;
						course.courseid = req.body.courseid || course.courseid;
						course.description = req.body.description || course.description;
						course.courseleader = req.body.courseleader || course.courseleader;

						College.update({_id: req.params.id}, college[0], function (err) {
							if (err)
								res.status(400).send(err);
							else
								res.json({message: 'Updated Course In College Profile!', data: course});
						});
						break;
					}else{
						res.status(404).json({message: 'Course NOT Found!'});
					}
				}
			}
		}
	});
};

router.deleteCollegeCourse = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college[0].course.length>0) {
				for (var i = 0; i < college[0].course.length; i++) {
					if (college[0].course[i]._id == req.params.cid) {
						var index = college[0].course.indexOf(college[0].course[i]);
						college[0].course.splice(index, 1);
						College.update({_id: req.params.id}, college[0], function (err) {
							if (err)
								res.status(400).send(err);
							else
								res.json({message: 'Deleted Course From College Profile!'});
						});
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

module.exports = router;