/*
* Express session https://www.codementor.io/emjay/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
* */
/* eslint no-console: "off"*/

var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var prod =  process.env.NODE_ENV === 'prod';

var index = require('./routes/index');
var main = require('./routes/main.js');
var student = require('./routes/student.js');
var college = require('./routes/college.js');
var course = require('./routes/course.js');
var review = require('./routes/review.js');
var authentication = require('./routes/authentication.js');
var googleimg = require('./routes/googleimg.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
if (prod) {
	app.use(express.static(path.join(__dirname, 'dist')));
} else {
	app.use(express.static(path.join(__dirname, '')));
}
app.use('/public', express.static(__dirname + '/public'));
app.use(session({
	key: 'user_sid',
	secret: 'unireviewweb',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 60000,
		httpOnly: false
	}
}));

//open mongo database
if(process.env.NODE_ENV !== 'test') {
	mongoose.connect('mongodb://localhost:27017/unireviewdb');
	var db = mongoose.connection;
	db.on('error', function (err) {
		console.log('connection error', err);
	});
	db.once('open', function () {
		console.log('connected to database');
	});
}

app.use('/', index);
app.get('/main',authentication.sessionChecker, main.main);

app.post('/auth/login', authentication.login);
app.get('/auth/logout', authentication.logout);

app.get('/googleimg/:keyword', googleimg.imagesearch);

app.get('/student', student.findAll);
app.get('/student/:id', student.findOne);
app.post('/student', student.addStudent);
app.delete('/student/:id', student.deleteStudent);
app.put('/student/:id', student.editStudent);
app.put('/student/:id/password', student.editStudentPassword);
app.post('/student/search', student.search);

app.get('/college', college.findAll);
app.get('/college/:id', college.findOne);
app.post('/college', college.addCollege);
app.delete('/college/:id', college.deleteCollege);
app.put('/college/:id', college.editCollege);
app.post('/college/search', college.search);
app.get('/college/:id/review', college.findAllCollegeReview, review.findAllMiddleware);
app.get('/college/:id/review/:rid', college.findOneCollegeReview, review.findOneMiddleware);
app.put('/college/:id/review/:rid', college.findOneCollegeReview, review.editReviewMiddleware);
app.post('/college/:id/review', review.addReviewMiddleware, college.addCollegeReview);
app.delete('/college/:id/review/:rid', college.deleteCollegeReview, review.deleteReviewMiddleware);

app.get('/college/:id/course', course.findAllCollegeCourse);
app.get('/college/:id/course/:cid', course.findOneCollegeCourse);
app.post('/college/:id/course', course.addCollegeCourse);
app.put('/college/:id/course/:cid', course.editCollegeCourse);
app.delete('/college/:id/course/:cid', course.deleteCollegeCourse);
app.get('/college/:id/course/:cid/review', course.findAllCourseReview, review.findAllMiddleware);
app.get('/college/:id/course/:cid/review/:rid', course.findOneCourseReview, review.findOneMiddleware);
app.delete('/college/:id/course/:cid/review/:rid', course.deleteCourseReview, review.deleteReviewMiddleware);
app.put('/college/:id/course/:cid/review/:rid', course.findOneCourseReview, review.editReviewMiddleware);
app.post('/college/:id/course/:cid/review', review.addReviewMiddleware, course.addCourseReview);

app.get('/review', review.findAll);
app.get('/review/:id', review.findOne);
app.post('/review', review.addReview);
app.delete('/review/:id', review.deleteReview);
app.put('/review/:id', review.editReview);
app.post('/review/search', review.search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session) {
		res.clearCookie('user_sid');
	}
	next();
});

module.exports = app;
