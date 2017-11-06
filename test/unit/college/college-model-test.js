var chai = require('chai');
var expect = chai.expect;
var College = require('../../../models/college');

var tempcollege = {};
describe('College Model Unit', function () {

	beforeEach(function () {
		tempcollege = {
			name: 'Waterford Institute of Technology',
			contactno: "0829374960",
			email: 'waterfordit@wit.ie',
			address: 'Cork Road, Waterford'
		}
	});

	describe('College Schema',function () {
		it('should create a college', function (done) {
			var college = new College(tempcollege);
			expect(college.validateSync()).to.not.exist;
			expect(college.name).to.equal(tempcollege.name);
			expect(college.email).to.equal(tempcollege.email);
			expect(college.address).to.equal(tempcollege.address);
			expect(college.contactno).to.equal(tempcollege.contactno);
			done();
		});

		it('should return error if email not available', function (done) {
			tempcollege.email = undefined;
			var college = new College();
			college.email = tempcollege.email;
			college.validate(function (err) {
				expect(err.errors.email.message).to.equal('Path `email` is required.');
				done();
			});
		});

		it('should return error if email format is incorrect',function (done) {
			tempcollege.email = 'asdasdasd';
			var college = new College();
			college.email = tempcollege.email;
			college.validate(function (err) {
				expect(err.errors.email.message).to.equal('Please fill a valid email address!');
				done();
			});
		});
	});
});