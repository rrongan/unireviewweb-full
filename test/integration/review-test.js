var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../app');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('Review', function () {
	this.timeout(120000);
	before(function (done) {
		mockgoose.prepareStorage().then(function () {
			mongoose.connect('mongodb://localhost:27017/unireviewdb', function (err) {
				done(err);
			});
		});
	});

	after((done) => {
		Object.keys(mongoose.connection.collections).forEach(col => {
			delete mongoose.connection.models[col];
		});

		mongoose.disconnect();
		done();
	});

	describe('POST /review',function () {
		it('should return confirmation message and update database', function(done) {
			var tempreview = {
				rating: 5,
				comment: "Very good",
				reviewer: "5a14996c1a26b93bd4979e89",
				type: "College"
			};
			request(app)
				.post('/review')
				.send(tempreview)
				.expect(201)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review Added!' ) ;
					done();
				});
		});
	});

	var tempid;
	describe('GET /review', function () {
		it('should GET all the reviews', function(done) {
			request(app)
				.get('/review')
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					tempid = res.body[0]._id;
					var result = _.map(res.body, function (review) {
						return {
							rating: review.rating,
							comment: review.comment,
							reviewer: review.reviewer,
							type: review.type
						};
					});
					expect(result[0]).to.include( {
						rating: 5,
						comment: "Very good",
						reviewer: "5a14996c1a26b93bd4979e89",
						type: "College"
					} );
					done();
				});
		});
	});

	describe('GET /review/:id', function () {
		it('should GET the specific review by id', function(done) {
			request(app)
				.get('/review/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					var result = _.map(res.body, function (review) {
						return {
							rating: review.rating,
							comment: review.comment,
							reviewer: review.reviewer,
							type: review.type
						};
					});
					expect(result).to.include( {
						rating: 5,
						comment: "Very good",
						reviewer: "5a14996c1a26b93bd4979e89",
						type: "College"
					} );
					done();
				});
		});

		it('should return 404 if review is not found', function(done) {
			request(app)
				.get('/review/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review NOT Found!' ) ;
					done();
				});
		});
	});

	describe('PUT /review/:id', function () {
		it('should return confirmation message and update review detail', function(done) {
			var modify = {
				rating: 4,
				comment: "Very good",
				reviewer: "5a14996c1a26b93bd4979e89",
				type: "College"
			};
			request(app)
				.put('/review/'+tempid)
				.send(modify)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review Updated!' ) ;
					var result = {
						rating: res.body.data.rating,
						comment: res.body.data.comment,
						reviewer: res.body.data.reviewer,
						type: res.body.data.type
					};
					expect(result).to.include( {
						rating: 4,
						comment: "Very good",
						reviewer: "5a14996c1a26b93bd4979e89",
						type: "College"
					} );
					done();
				});
		});

		it('should return 404 if review is not found', function(done) {
			request(app)
				.put('/review/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review NOT Found!' ) ;
					done();
				});
		});
	});

	describe('POST /review/search',function () {
		it('should return searched result when value is found', function (done) {
			var value = {
				'key':['comment'],
				'value':'Very good'
			};
			request(app)
				.post('/review/search')
				.send(value)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					var result = _.map(res.body, function (review) {
						return {
							rating: review.rating,
							comment: review.comment,
							reviewer: review.reviewer,
							type: review.type
						};
					});
					expect(result[0]).to.include( {
						rating: '4',
						comment: "Very good",
						reviewer: "5a14996c1a26b93bd4979e89",
						type: "College"
					} );
					done();
				});
		});

		it('should return 404 if review is not found', function(done) {
			var value = {
				'key':['comment'],
				'value':'q'
			};
			request(app)
				.post('/review/search')
				.send(value)
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Result Not Found!' ) ;
					done();
				});
		});
	});

	describe('DELETE /review/:id', function () {
		it('should DELETE the specific review by id', function(done) {
			request(app)
				.delete('/review/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review Deleted!' ) ;
					done();
				});
		});

		it('should return 404 if review is not found', function(done) {
			request(app)
				.delete('/review/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Review Not Found!' ) ;
					done();
				});
		});
	});
});