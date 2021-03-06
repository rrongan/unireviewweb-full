var College = require('../models/college');
var express = require('express');
var Fuse = require('fuse.js');

var router = express.Router();

router.findAll = function(req, res) {

	College.find(function(err, college) {
		if (err)
			res.status(400).send(err);

		res.json(college);
	});
};

router.findOne = function(req, res) {

	College.find({ '_id' : req.params.id },function(err, college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err } );
		else
			res.json(college);
	});
};

router.addCollege = function(req, res) {

	var college = new College();

	college.name = req.body.name;
	college.email = req.body.email;
	college.contactno = req.body.contactno;
	college.address = req.body.address;
	college.website = req.body.website;
	college.description = req.body.description;

	college.save(function(err) {
		if (err)
			res.status(400).send(err);
		else
			res.status(201).json({ message: 'College Added!', data: college });
	});
};

router.deleteCollege = function(req, res) {
	College.findByIdAndRemove(req.params.id, function(err) {
		if (err)
			res.status(404).json({ message: 'College Not Found!', errmsg : err});
		else
			res.json({ message: 'College Deleted!'});
	});
};

router.editCollege = function(req, res) {

	var edit_college = College;

	edit_college.findById(req.params.id, function(err,college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err});
		else {
			try {
				college.name = req.body.name || college.name;
				college.contactno = req.body.contactno || college.contactno;
				college.address = req.body.address || college.address;
				college.website = req.body.website || college.website;
				college.description = req.body.description;
				if(req.body.email)
					college.email = req.body.email;
				College.update({_id:req.params.id},college,function (err) {
					if (err)
						res.status(400).send(err);
					else
						res.json({ message: 'College Updated!', data: college });
				});
			}catch (e){
				res.status(400).json({message:'Edit College Error: ',errmsg: e.message});
			}
		}
	});
};

router.search = function(req, res) {

	College.find().lean().exec(function(err, college) {
		if (err)
			res.status(400).send(err);

		var colleges = college;
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

		var fuse = new Fuse(colleges,options);
		var result = fuse.search(req.body.value);

		if(result.length > 0){
			return res.json(result);
		}else{
			res.status(404).json({ message: 'Result Not Found!'});
		}
	});
};

router.addCollegeReview = function(req, res) {

	var edit_college = College;

	edit_college.findById(req.params.id, function(err,college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err});
		else {
			var array = [];
			try {
				if (Array.isArray(college.reviewid)) {
					college.reviewid.push(req.reviewid);
				} else {
					array.push(req.reviewid);
					college.reviewid = array;
				}

				College.update({_id:req.params.id},college,function (err) {
					if (err)
						res.status(400).send(err);
					else {
						res.json({message: 'Review Added to College Profile!', data: college});
					}
				});
			}catch (e){
				res.status(400).json({message:'Add College Review Error: ',errmsg: e.message});
			}
		}
	});
};

router.findAllCollegeReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err } );
		else {
			req.reviewids = college.reviewid;
			next();
		}
	});
};

router.findOneCollegeReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err } );
		else {
			for(var i=0;i<college.reviewid.length;i++){
				if(college.reviewid[i] == req.params.rid){
					req.reviewid = req.params.rid;
					break;
				}else{
					req.reviewid = undefined;
				}
			}
			next();
		}
	});
};

router.deleteCollegeReview = function(req, res, next) {

	College.findById({ '_id' : req.params.id },function(err, college) {
		if (err)
			res.status(404).json({ message: 'College NOT Found!', errmsg : err } );
		else {
			for(var i=0;i<college.reviewid.length;i++){
				if(college.reviewid[i] == req.params.rid){
					req.reviewid = req.params.rid;
					var index = college.reviewid.indexOf(college.reviewid[i]);
					college.reviewid.splice(index, 1);
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
		}
	});
};

module.exports = router;