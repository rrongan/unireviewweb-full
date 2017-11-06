var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../app');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('College', function () {
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

	describe('POST /college',function () {
		it('should return confirmation message and update database', function(done) {
			tempcollege = {
				name: 'Waterford Institute of Technology',
				contactno: "0829374960",
				email: 'waterfordit@wit.ie',
				address: 'Cork Road, Waterford'
			};
			request(app)
				.post('/college')
				.send(tempcollege)
				.expect(201)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College Added!' ) ;
					done();
				});
		});

		it('should return error message when email is already exist', function(done) {
			tempcollege = {
				name: 'Waterford Institute of Technology',
				contactno: "0829374960",
				email: 'waterfordit@wit.ie',
				address: 'Cork Road, Waterford'
			};
			request(app)
				.post('/college')
				.send(tempcollege)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College validation failed: email: Email Already Exists!' ) ;
					done();
				});
		});

		it('should return error message when email format is incorrect', function(done) {
			tempcollege = {
				name: 'Waterford Institute of Technology',
				contactno: "0829374960",
				email: 'waterfordit',
				address: 'Cork Road, Waterford'
			};
			request(app)
				.post('/college')
				.send(tempcollege)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College validation failed: email: Please fill a valid email address!' ) ;
					done();
				});
		});
	});

	var tempid;
	describe('GET /college', function () {
		it('should GET all the colleges', function(done) {
			request(app)
				.get('/college')
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					tempid = res.body[0]._id;
					var result = _.map(res.body, function (college) {
						return {
							name: college.name,
							contactno: college.contactno,
							email: college.email,
							address: college.address
						};
					});
					expect(result[0]).to.include( {
						name: 'Waterford Institute of Technology',
						contactno: "0829374960",
						email: 'waterfordit@wit.ie',
						address: 'Cork Road, Waterford'
					} );
					done();
				});
		});
	});

	describe('GET /college/:id', function () {
		it('should GET the specific college by id', function(done) {
			request(app)
				.get('/college/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					var result = _.map(res.body, function (college) {
						return {
							name: college.name,
							contactno: college.contactno,
							email: college.email,
							address: college.address
						};
					});
					expect(result).to.include( {
						name: 'Waterford Institute of Technology',
						contactno: "0829374960",
						email: 'waterfordit@wit.ie',
						address: 'Cork Road, Waterford'
					} );
					done();
				});
		});

		it('should return 404 if college is not found', function(done) {
			request(app)
				.get('/college/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College NOT Found!' ) ;
					done();
				});
		});
	});

	describe('PUT /college/:id', function () {
		it('should return confirmation message and update college detail', function(done) {
			var modify = {
				name: 'Cork Institute of Technology',
				contactno: "082123132",
				email: 'cork@cit.ie',
				address: 'Kilkenny Road, Carlow'
			};
			request(app)
				.put('/college/'+tempid)
				.send(modify)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College Updated!' ) ;
					var result = {
						name: res.body.data.name,
						contactno: res.body.data.contactno,
						email: res.body.data.email,
						address: res.body.data.address
					};
					expect(result).to.include( {
						name: 'Cork Institute of Technology',
						contactno: "082123132",
						email: 'cork@cit.ie',
						address: 'Kilkenny Road, Carlow'
					} );
					done();
				});
		});

		it('should return 404 if college is not found', function(done) {
			request(app)
				.put('/college/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College NOT Found!' ) ;
					done();
				});
		});
	});

	describe('POST /college/search',function () {
		it('should return searched result when value is found', function (done) {
			var value = {
				'key':['name'],
				'value':'C'
			};
			request(app)
				.post('/college/search')
				.send(value)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					var result = _.map(res.body, function (college) {
						return {
							name: college.name,
							contactno: college.contactno,
							email: college.email,
							address: college.address
						};
					});
					expect(result[0]).to.include( {
						name: 'Cork Institute of Technology',
						contactno: "082123132",
						email: 'cork@cit.ie',
						address: 'Kilkenny Road, Carlow'
					} );
					done();
				});
		});

		it('should return 404 if college is not found', function(done) {
			var value = {
				'key':['name','college.name'],
				'value':'q'
			};
			request(app)
				.post('/college/search')
				.send(value)
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Result Not Found!' ) ;
					done();
				});
		});
	});

	describe('DELETE /college/:id', function () {
		it('should DELETE the specific college by id', function(done) {
			request(app)
				.delete('/college/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College Deleted!' ) ;
					done();
				});
		});

		it('should return 404 if college is not found', function(done) {
			request(app)
				.delete('/college/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('College Not Found!' ) ;
					done();
				});
		});
	});
});