var mongoose = require('mongoose');
var Course = require('../models/course').schema;

var CollegeSchema = new mongoose.Schema({
	name: String,
	email: {type:String, required:true, index: {unique:true},
		validate: [function(email) {
			return /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
		},'Please fill a valid email address!']
	},
	contactno: String,
	address: String,
	website: String,
	description: String,
	course: [Course]
});

CollegeSchema.path('email').validate(function(value, done) {
	this.model('College').count({ email: value }, function(err, count) {
		if (err) {
			return done(err);
		}
		done(!count);
	});
}, 'Email Already Exists!');

module.exports = mongoose.model('College', CollegeSchema);