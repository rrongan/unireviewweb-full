var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

var CollegeSchema = new mongoose.Schema({
	name: String,
	email: {type:String, required:true, index: {unique:true},
		validate: [function(email) {
			return /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
		},'Please fill a valid email address!']
	},
	contactno: String,
	address: String,
	course:{
		name: String,
		coursecode: String,
		courseleader: String,
		subject: {
			year: Number,
			name: String,
			lecturer: String
		}
	}
});

module.exports = mongoose.model('Student', CollegeSchema);