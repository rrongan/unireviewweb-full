/*
*  Mongoose password hashing - https://stackoverflow.com/questions/14588032/mongoose-password-hashing
*                            - https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
*
* */

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

var StudentSchema = new mongoose.Schema({
	name: String,
	email: {type:String, required:true, index: {unique:true},
		validate: [function(email) {
			return /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
		},'Please fill a valid email address!']
	},
	studentid: String,
	dob: Date,
	gender: {type: String, enum: ['Male', 'Female','Not Disclose']},
	address: String,
	username: {type:String, required:true, index: {unique:true}},
	password: { type: String, required: true },
	college:{
		name: String,
		course: {
			name: String,
			year: Number
		}
	}
});

StudentSchema.path('email').validate(function(value, done) {
	this.model('Student').count({ email: value }, function(err, count) {
		if (err) {
			return done(err);
		}
		done(!count);
	});
}, 'Email Already Exists!');

StudentSchema.path('username').validate(function(value, done) {
	this.model('Student').count({ username: value }, function(err, count) {
		if (err) {
			return done(err);
		}
		done(!count);
	});
}, 'Username Already Exists!');

StudentSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

StudentSchema.pre('update', function(next) {
	var user = this;

	if(user._update.$set.password !== undefined) {
		// generate a salt
		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
			if (err) return next(err);
			// hash the password using our new salt
			bcrypt.hash(user._update.$set.password, salt, function (err, hash) {
				if (err) return next(err);

				// override the cleartext password with the hashed one
				user._update.$set.password = hash;
				next();
			});
		});
	}else{
		next();
	}
});

StudentSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Student', StudentSchema);