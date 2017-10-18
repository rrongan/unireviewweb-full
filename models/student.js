var mongoose = require('mongoose');

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

module.exports = mongoose.model('Student', StudentSchema);