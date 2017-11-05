/*
* Mockgoose Tutorial https://github.com/EnergeticPixels/testingMockgoose/blob/master/test/routes/user_test.js
*                    https://github.com/mockgoose/mockgoose
* Supertest https://github.com/visionmedia/supertest
* */

var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
process.env.NODE_ENV = 'testing';
var app = require('../../app');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('Student', function () {
	this.timeout(120000);
	before(function(done) {
		mockgoose.prepareStorage().then(function() {
			mongoose.connect('mongodb://localhost:27017/unireviewdb', function(err) {
				done(err);
			});
		});
	});

	after( (done) => {
		Object.keys( mongoose.connection.collections ).forEach( col => {
			delete mongoose.connection.models[col];
		} );

		mockgoose.helper.reset( function ( ) {
			mongoose.disconnect();
		}).then(() => {
			done();
		});
	});

	describe('POST /student',function () {
		it('should return confirmation message and update database', function(done) {
			var tempstudent = {
				dob:'2000-01-01',
				name:'Temp Student',
				studentid:20010001,
				email:'tempstudent@gmail.com',
				username:'tempstudent',
				password:'tempstudent00',
				college:{
					name:'Waterford Institute of Technology',
					course:{
						year:2,
						name:'BSc in Software System Development'
					}
				}
			};
			request(app)
				.post('/student')
				.send(tempstudent)
				.expect(201)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student Added!' ) ;
					done();
				});
		});

		it('should return error message when username is already exist', function(done) {
			var tempstudent = {
				dob:'2000-01-02',
				name:'Temp Student 2',
				studentid:20010002,
				email:'tempstudent2@gmail.com',
				username:'tempstudent',
				password:'tempstudent01',
				college:{
					name:'Waterford Institute of Technology',
					course:{
						year:3,
						name:'BSc in Software System Development'
					}
				}
			};
			request(app)
				.post('/student')
				.send(tempstudent)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student validation failed: username: Username Already Exists!' ) ;
					done();
				});
		});

		it('should return error message when email is already exist', function(done) {
			var tempstudent = {
				dob:'2000-01-03',
				name:'Temp Student 3',
				studentid:20010003,
				email:'tempstudent@gmail.com',
				username:'tempstudent2',
				password:'tempstudent02',
				college:{
					name:'Waterford Institute of Technology',
					course:{
						year:1,
						name:'BSc in Software System Development'
					}
				}
			};
			request(app)
				.post('/student')
				.send(tempstudent)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student validation failed: email: Email Already Exists!' ) ;
					done();
				});
		});

		it('should return error message when email format is incorrect', function(done) {
			var tempstudent = {
				dob:'2000-01-03',
				name:'Temp Student 3',
				studentid:20010003,
				email:'tempstudent',
				username:'tempstudent2',
				password:'tempstudent02',
				college:{
					name:'Waterford Institute of Technology',
					course:{
						year:1,
						name:'BSc in Software System Development'
					}
				}
			};
			request(app)
				.post('/student')
				.send(tempstudent)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student validation failed: email: Please fill a valid email address!' ) ;
					done();
				});
		});
	});

	var tempid;
	describe('GET /student', function () {
		it('should GET all the students', function(done) {
			request(app)
				.get('/student')
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					tempid = res.body[0]._id;
					var result = _.map(res.body, function (student) {
						return {
							studentid: student.studentid,
							name: student.name,
							username: student.username,
							email: student.email
						};
					});
					expect(result).to.include( {
						studentid: '20010001',
						name: 'Temp Student',
						username: 'tempstudent',
						email: 'tempstudent@gmail.com'
					} );
					done();
				});
		});
	});

	describe('GET /student/:id', function () {
		it('should GET the specific student by id', function(done) {
			request(app)
				.get('/student/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.be.a('array');
					var result = _.map(res.body, function (student) {
						return {
							studentid: student.studentid,
							name: student.name,
							username: student.username,
							email: student.email
						};
					});
					expect(result).to.include( {
						studentid: '20010001',
						name: 'Temp Student',
						username: 'tempstudent',
						email: 'tempstudent@gmail.com'
					} );
					done();
				});
		});

		it('should return 404 if student is not found', function(done) {
			request(app)
				.get('/student/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student NOT Found!' ) ;
					done();
				});
		});
	});

	describe('PUT /student/:id', function () {
		it('should return confirmation message and update student detail', function(done) {
			var modify = {
				dob:'2000-02-02',
				name:'Temp STUDENT',
				studentid:20020002,
				username: 'tempstudentt',
				email: 'tempstudentt@gmail.com',
				college:{
					name:'Waterford Institute of Technology',
					course:{
						year:2,
						name:'BSc in Software System Development'
					}
				}
			};
			request(app)
				.put('/student/'+tempid)
				.send(modify)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student Updated!' ) ;
					var result = {
						studentid: res.body.data.studentid,
						name: res.body.data.name,
						username: res.body.data.username,
						email: res.body.data.email
					};
					expect(result).to.include( {
						studentid: '20020002',
						name: 'Temp STUDENT',
						username: 'tempstudentt',
						email: 'tempstudentt@gmail.com'
					} );
					done();
				});
		});

		it('should return 404 if student is not found', function(done) {
			request(app)
				.put('/student/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student NOT Found!' ) ;
					done();
				});
		});
	});

	describe('PUT /student/:id/password', function () {
		it('should return confirmation message and update student password', function(done) {
			var modify = {
				'oldpassword':'tempstudent00',
				'reenterpassword':'tempstudent00',
				'newpassword':'tempstudent01'
			};
			request(app)
				.put('/student/'+tempid+'/password')
				.send(modify)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student Password Updated!' ) ;
					done();
				});
		});

		it('should return error message when old password and reenter password is not equal', function(done) {
			var modify = {
				'oldpassword':'tempstudent00',
				'reenterpassword':'tempstudent01',
				'newpassword':'tempstudent01'
			};
			request(app)
				.put('/student/'+tempid+'/password')
				.send(modify)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Password Not Match With Re-enter Password, Please Try Again!' ) ;
					done();
				});
		});

		it('should return error message when password entered is incorrect', function(done) {
			var modify = {
				'oldpassword':'tempstudent00',
				'reenterpassword':'tempstudent00',
				'newpassword':'tempstudent02'
			};
			request(app)
				.put('/student/'+tempid+'/password')
				.send(modify)
				.expect(400)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Incorrect Password!' ) ;
					done();
				});
		});

		it('should return 404 if student is not found', function(done) {
			request(app)
				.put('/student/'+tempid+'1/password')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student NOT Found!' ) ;
					done();
				});
		});
	});

	describe('POST /student/search',function () {
		it('should return searched result when value is found', function (done) {
			var value = {
				'key':['name','college.name'],
				'value':'Temp'
			};
			request(app)
				.post('/student/search')
				.send(value)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					var result = _.map(res.body, function (student) {
						return {
							studentid: student.studentid,
							name: student.name,
							username: student.username,
							email: student.email
						};
					});
					expect(result).to.include( {
						studentid: '20020002',
						name: 'Temp STUDENT',
						username: 'tempstudentt',
						email: 'tempstudentt@gmail.com'
					} );
					done();
				});
		});

		it('should return 404 if student is not found', function(done) {
			var value = {
				'key':['name','college.name'],
				'value':'q'
			};
			request(app)
				.post('/student/search')
				.send(value)
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Result Not Found!' ) ;
					done();
				});
		});
	});

	describe('DELETE /student/:id', function () {
		it('should DELETE the specific student by id', function(done) {
			request(app)
				.delete('/student/'+tempid)
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student Deleted!' ) ;
					done();
				});
		});

		it('should return 404 if student is not found', function(done) {
			request(app)
				.delete('/student/'+tempid+'1')
				.expect(404)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body).to.have.property('message').equal('Student Not Found!' ) ;
					done();
				});
		});
	});
});
