var chai = require('chai');
var expect = chai.expect;
var Student = require('../../../models/student');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var tempstudent = {};
describe('Student Model Unit', function () {
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

	afterEach((done) => {
		mockgoose.helper.reset().then(() => {
			done();
		});
	});

	beforeEach(function () {
		tempstudent = {
			dob: '2000-01-01',
			name: 'Temp Student',
			studentid: 20010001,
			email: 'tempstudent@gmail.com',
			gender: 'Male',
			address: '1 temproad, tempplace',
			username: 'tempstudent',
			password: 'tempstudent00',
			college: {
				name: 'Waterford Institute of Technology',
				course: {
					year: 2,
					name: 'BSc in Software System Development'
				}
			}
		};
	});

	describe('Student Schema',function () {
		it('should create a student', function (done) {
			var student = new Student(tempstudent);
			expect(student.validateSync()).to.not.exist;
			expect(Date.parse(student.dob)).to.equal(Date.parse(tempstudent.dob));
			expect(student.name).to.equal(tempstudent.name);
			expect(student.studentid).to.equal(tempstudent.studentid.toString());
			expect(student.email).to.equal(tempstudent.email);
			expect(student.username).to.equal(tempstudent.username);
			expect(student.password).to.equal(tempstudent.password);
			expect(student.gender).to.equal(tempstudent.gender);
			expect(student.address).to.equal(tempstudent.address);
			expect(student.college.name).to.equal(tempstudent.college.name);
			expect(student.college.course.name).to.equal(tempstudent.college.course.name);
			expect(student.college.course.year).to.equal(tempstudent.college.course.year);
			done();
		});

		it('should return error if email not available', function (done) {
			tempstudent.email = undefined;
			var student = new Student();
			student.email = tempstudent.email;
			student.validate(function (err) {
				expect(err.errors.email.message).to.equal('Path `email` is required.');
				done();
			});
		});

		it('should return error if username not available', function (done) {
			tempstudent.username = undefined;
			var student = new Student();
			student.username = tempstudent.username;
			student.validate(function (err) {
				expect(err.errors.username.message).to.equal('Path `username` is required.');
				done();
			});
		});

		it('should return error if password not available', function (done) {
			tempstudent.password = undefined;
			var student = new Student();
			student.password = tempstudent.password;
			student.validate(function (err) {
				expect(err.errors.password.message).to.equal('Path `password` is required.');
				done();
			});
		});

		it('should return error if email format is incorrect',function (done) {
			tempstudent.email = 'asdasdasd';
			var student = new Student();
			student.email = tempstudent.email;
			student.validate(function (err) {
				expect(err.errors.email.message).to.equal('Please fill a valid email address!');
				done();
			});
		});

		it('should return error if gender is not in correct form', function (done) {
			tempstudent.gender = 'asdasd';
			var student = new Student();
			student.gender = tempstudent.gender;
			student.validate(function (err) {
				expect(err.errors.gender.message).to.equal('`asdasd` is not a valid enum value for path `gender`.');
				done();
			});
		});
	});

	describe('Schema Custom Validator',function () {
		it('should return error if email is existed',function (done) {
			var student = new Student(tempstudent);
			student.save().then(function () {
				var student2 = new Student(tempstudent);
				student2.save(function (err) {
					expect(err.errors.email.message).to.equal('Email Already Exists!');
					done();
				});
			});
		});

		it('should return error if username is existed', function (done) {
			var student = new Student(tempstudent);
			student.save().then(function () {
				var student2 = new Student(tempstudent);
				student2.save(function (err) {
					expect(err.errors.username.message).to.equal('Username Already Exists!');
					done();
				});
			});
		});
	});

	describe('Save, Update and Compare Encrypted Password',function () {
		it('should encrypt the password after student is saved', function (done) {
			var student = new Student(tempstudent);
			student.save().then(function () {
				Student.find(function (err, student) {
					expect(student.password).to.not.equal(tempstudent.password);
					done();
				});
			});
		});

		it('should be able to update the password', function (done) {
			var student = new Student(tempstudent);
			var newpass = 'asdasdas';
			var oldencryptedpass;
			student.save().then(function () {
				Student.find(function (err, student) {
					oldencryptedpass = student[0].password;
					Student.update({_id: student[0]}, {password: newpass}).then(function () {
						Student.find(function (err, student) {
							expect(student[0].password).to.not.equal(oldencryptedpass);
							done();
						});
					});
				});
			});
		});

		it('should match the password with the saved password',function (done) {
			var student = new Student(tempstudent);
			student.save().then(function () {
				Student.find(function (err,student) {
					student[0].comparePassword(tempstudent.password,function(err, isMatch){
						expect(isMatch).to.equal(true);
						done();
					});
				});
			});
		});
	});
});