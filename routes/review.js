var Review = require('../models/review');
var express = require('express');
var Fuse = require('fuse.js');

var router = express.Router();

router.findAll = function(req, res) {

	Review.find(function(err, review) {
		if (err)
			res.status(400).send(err);

		res.json(review);
	});
};

router.findAllMiddleware = function(req, res) {

	Review.find({ '_id' : {$in: req.reviewids }},function(err, review) {
		if (err)
			res.status(404).json({ message: 'Review NOT Found!', errmsg : err } );
		else {
			res.json(review);
		}
	});
};

router.findOne = function(req, res) {

	Review.find({ '_id' : req.params.id },function(err, review) {
		if (err)
			res.status(404).json({ message: 'Review NOT Found!', errmsg : err } );
		else {
			res.json(review);
		}
	});
};

router.findOneMiddleware = function(req, res) {

	Review.find({ '_id' : req.reviewid },function(err, review) {
		if (err)
			res.status(404).json({ message: 'Review NOT Found!', errmsg : err } );
		else {
			res.json(review);
		}
	});
};

router.addReview = function(req, res) {

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
		}
	});
};

router.addReviewMiddleware = function(req, res, next) {

	var review = new Review();

	review.rating = req.body.rating;
	review.comment = req.body.comment;
	review.reviewer = req.body.reviewer;
	review.type = req.body.type;

	review.save(function(err) {
		if (err)
			res.status(400).send(err);
		else {
			req.reviewid = review._id;
			next();
		}
	});
};

router.deleteReview = function(req, res) {
	Review.findByIdAndRemove(req.params.id, function(err) {
		if (err)
			res.status(404).json({ message: 'Review Not Found!', errmsg : err});
		else {
			res.json({message: 'Review Deleted!'});
		}
	});
};

router.deleteReviewMiddleware = function(req, res) {
	if(req.reviewid !== undefined) {
		Review.findByIdAndRemove(req.reviewid, function (err) {
			if (err)
				res.status(404).json({message: 'Review Not Found!', errmsg: err});
			else {
				res.json({message: 'Review Deleted!'});
			}
		});
	}else
		res.status(404).json({message: 'Review Not Found!'});
};

router.editReview = function(req, res) {

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
					}
				});
			}catch (e){
				res.status(400).json({message:'Edit Review Error: ',errmsg: e.message});
			}
		}
	});
};

router.editReviewMiddleware = function(req, res) {

	var edit_review = Review;

	if(req.reviewid !== undefined) {
		edit_review.findById(req.reviewid, function (err, review) {
			if (err)
				res.status(404).json({message: 'Review NOT Found!', errmsg: err});
			else {
				try {
					review.rating = req.body.rating || review.rating;
					review.comment = req.body.comment || review.comment;
					review.reviewer = req.body.reviewer || review.reviewer;
					review.type = req.body.type || review.type;

					Review.update({_id: req.reviewid}, review, function (err) {
						if (err)
							res.status(400).send(err);
						else {
							res.json({message: 'Review Updated!', data: review});
						}
					});
				} catch (e) {
					res.status(400).json({message: 'Edit Review Error: ', errmsg: e.message});
				}
			}
		});
	}else
		res.status(404).json({message: 'Review NOT Found!'});
};

router.search = function(req, res) {

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
		}else{
			res.status(404).json({ message: 'Result Not Found!'});
		}
	});
};

module.exports = router;