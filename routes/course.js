var College = require('../models/college');
var Course = require('../models/course').model;
var express = require('express');

var router = express.Router();

router.addCollegeCourse = function(req, res) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(!college){
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
				for(var i=0;i<college.course.length;i++){
					if(college.course[i].courseid === course.courseid){
						res.status(400).json({message: 'Course Code Is Already Exists!'});
						check = false;
						break;
					}
				}
				if(check) {
					if (Array.isArray(college.course)) {
						college.course.push(course);
					} else {
						array.push(course);
						college.course = array;
					}
					College.update({_id: req.params.id}, college, function (err) {
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

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			res.json(college.course);
		}
	});
};

router.findOneCollegeCourse = function(req, res) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length>0) {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						res.json(college.course[i]);
					}else{
						res.status(404).json({message: 'Course NOT Found!'});
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

router.editCollegeCourse = function(req, res) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length < 1){
				res.status(404).json({message: 'Course NOT Found!'});
			}else {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						var course = college.course[i];

						course.name = req.body.name || course.name;
						course.courseid = req.body.courseid || course.courseid;
						course.description = req.body.description || course.description;
						course.courseleader = req.body.courseleader || course.courseleader;

						College.update({_id: req.params.id}, college, function (err) {
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

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length>0) {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						var index = college.course.indexOf(college.course[i]);
						college.course.splice(index, 1);
						College.update({_id: req.params.id}, college, function (err) {
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

router.addCourseReview = function(req, res) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length < 1){
				res.status(404).json({message: 'Course NOT Found!'});
			}else {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						var array = [];
						var course = college.course[i];

						if (Array.isArray(course.reviewid)) {
							course.reviewid.push(req.reviewid);
						} else {
							array.push(req.reviewid);
							course.reviewid = array;
						}

						College.update({_id: req.params.id}, college, function (err) {
							if (err)
								res.status(400).send(err);
							else
								res.json({message: 'Review Added to Course Profile!', data: course});
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

router.findAllCourseReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length>0) {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						req.reviewids = college.course[i].reviewid;
						next();
					}else{
						res.status(404).json({message: 'Course NOT Found!'});
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

router.findOneCourseReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length>0) {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						for(var j=0;j<college.reviewid.length;j++){
							if(college.course[i].reviewid[j] == req.params.rid){
								req.reviewid = req.params.rid;
								break;
							}else{
								req.reviewid = undefined;
							}
						}
						next();
					}else{
						res.status(404).json({message: 'Course NOT Found!'});
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

router.deleteCourseReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err) {
			res.status(404).json({message: 'College NOT Found!', errmsg: err});
		}else if(college.length < 1){
			res.status(404).json({message: 'College NOT Found!'});
		}
		else {
			if(college.course.length>0) {
				for (var i = 0; i < college.course.length; i++) {
					if (college.course[i]._id == req.params.cid) {
						for(var j=0;j<college.reviewid.length;j++){
							if(college.course[i].reviewid[j] == req.params.rid){
								req.reviewid = req.params.rid;
								var index = college.course[i].reviewid.indexOf(college.course[i].reviewid[j]);
								college.course[i].reviewid.splice(index, 1);
								College.update({_id:req.params.id},college,function (err) {
									if (err)
										res.status(400).send(err);
									else {
										next();
									}
								});
								break;
							}else{
								req.reviewid = undefined;
							}
						}
						next();
					}else{
						res.status(404).json({message: 'Course NOT Found!'});
					}
				}
			}else{
				res.status(404).json({message: 'Course NOT Found!'});
			}
		}
	});
};

module.exports = router;