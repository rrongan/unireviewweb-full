/*
* Manage session and authentication https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/
* */

var Student = require('../models/student');
var express = require('express');
var router = express.Router();

router.login = function(req, res) {
	Student.findOne({'username' : req.body.username }, function(err,student) {
		if (err)
			res.send(err);
		if(student !== null) {
			student.comparePassword(req.body.password, function (err, isMatch) {
				if (err)
					res.send(err);
				if (isMatch) {
					res.json({
						message: 'Successfully Login!',
						users:{
							username:req.body.username,
							studentid:student._id,
							name: student.name
						}
					});
				} else {
					res.status(401).json({message: 'Authentication Failed. Invalid Username or Password!'});
				}
			});
		}else{
			res.status(401).json({message: 'Authentication Failed. Invalid Username or Password!'});
		}
	});
};

router.logout = function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('/');
		}
	});
};

router.sessionChecker = (req, res, next) => {
	if (req.session.cookie.maxAge && req.session._id) {
		next();
	} else {
		res.redirect('/');
	}
};


module.exports = router;
