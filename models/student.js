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
    email: String,
    studentid: String,
    dob: Date,
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

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user._update.$set.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user._update.$set.password = hash;
            next();
        });
    });
});

StudentSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Student', StudentSchema);