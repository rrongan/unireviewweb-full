var Review = require('../models/review');
var express = require('express');
var Fuse = require('fuse.js');

var router = express.Router();

router.findAll = function(req, res, next) {

	Review.find(function(err, review) {
		if (err)
			res.status(400).send(err);

		res.json(review);
		next();
	});
};

router.findOne = function(req, res, next) {

	Review.find({ '_id' : req.params.id },function(err, review) {
		if (err)
			res.status(404).json({ message: 'Review NOT Found!', errmsg : err } );
		else {
			res.json(review);
			next();
		}
	});
};

router.addReview = function(req, res, next) {

	var review = new Review();

	review.rating = req.body.rating;
	review.comment = req.body.comment;
	review.reviewer = req.body.reviewer;
	review.type = req.body.type;

	review.save(function(err) {
		if (err)
			res.status(400).send(err);
		else {
			res.status(201).json({message: 'Review Added!', data: review});
			next();
		}
	});
};

router.deleteReview = function(req, res, next) {
	Review.findByIdAndRemove(req.params.id, function(err) {
		if (err)
			res.status(404).json({ message: 'Review Not Found!', errmsg : err});
		else {
			res.json({message: 'Review Deleted!'});
			next();
		}
	});
};

router.editReview = function(req, res, next) {

	var edit_review = Review;

	edit_review.findById(req.params.id, function(err,review) {
		if (err)
			res.status(404).json({ message: 'Review NOT Found!', errmsg : err});
		else {
			try {
				review.rating = req.body.rating || review.rating;
				review.comment = req.body.comment || review.comment;
				review.reviewer = req.body.reviewer || review.reviewer;
				review.type = req.body.type || review.type;

				Review.update({_id:req.params.id},review,function (err) {
					if (err)
						res.status(400).send(err);
					else {
						res.json({message: 'Review Updated!', data: review});
						next();
					}
				});
			}catch (e){
				res.status(400).json({message:'Edit Review Error: ',errmsg: e.message});
			}
		}
	});
};

router.search = function(req, res, next) {

	Review.find().lean().exec(function(err, review) {
		if (err)
			res.status(400).send(err);

		for(var r=0;r<review.length;r++){
			review[r].rating = review[r].rating.toString();
		}
		var reviews = review;
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

		var fuse = new Fuse(reviews,options);
		var result = fuse.search(req.body.value);

		if(result.length > 0){
			res.json(result);
			next();
		}else{
			res.status(404).json({ message: 'Result Not Found!'});
		}
	});
};

module.exports = router;