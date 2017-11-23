var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	name: String,
	courseid: {type:String, required:true},
	description: String,
	courseleader: String,
	reviewid: [String]
});

module.exports = {
	schema: CourseSchema,
	model: mongoose.model('Course', CourseSchema)
};