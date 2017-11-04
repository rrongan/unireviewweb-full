<!-- eslint-disable no-alert -->

# Academic Review Web Application Backend
Name: Yun Shen Tan

Student Number: 20065126
## Overview
This GitHub repository contains the source code for the part of backend of my web application.
The web application is the project for both Web Applications Development and Agile Software Practices modules.

The web application collects universities reviews, including the reviews of courses and subjects in these universities 
from students who studied in the universities before and displays them for all members to see.

This is the backend API that will let students to add review for universities and courses they studied. This project is 
just provide the student endpoints and authentication.

## API endpoints
+ app.use('/', index);
+ app.get('/main',authentication.sessionChecker, main.main);
+ app.post('/auth/login', authentication.login);
+ app.get('/auth/logout', authentication.logout);
+ app.get('/student', student.findAll);
+ app.get('/student/:id', student.findOne);
+ app.post('/student', student.addStudent);
+ app.delete('/student/:id', student.deleteStudent);
+ app.put('/student/:id', student.editStudent);
+ app.put('/student/:id/password', student.editStudentPassword);
+ app.post('/student/search', student.search);

## Data storage
MongoDB has been used in this project. The database contain one collection __Student__. The Student collection has the basic detail of student.

### Student
````js
var StudentSchema = new mongoose.Schema({
    name: String,
    email: {type:String, required:true, index: {unique:true}},
    studentid: String,
    dob: Date,
    gender: {type: String, enum: ["Male", "Female","Not Disclose"]},
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
````
The model can generate the object in the format below:
````json
{
        "_id": "59f9394ee5f5e832142fc0ec",
        "dob": "1995-08-23T00:00:00.000Z",
        "email": "rrongan@gmail.com",
        "name": "Yun Shen Tan",
        "studentid": "20065126",
        "password": "$2a$10$omjJnqZNeGArPcCJzxs2eewZ9AlfJNKgI4uvR6tF8MiMbTdb3dREC",
        "username": "yunshen",
        "__v": 0,
        "college": {
            "name": "Waterford Institute of Technology",
            "course": {
                "name": "BSc (H) in Software System Development",
                "year": 4
            }
        }
    }
````

## Sample Test Execution
There are two test suites in this project, __Authentication__ and __Student__. Both test suites can be run in single 
command `npm test`.The section below include a listing of 
the output from running the test suites.

### Student

    $ npm test
    
    > unireviewweb@0.0.0 test C:\Users\USER\WebstormProjects\unireviewweb
    > mocha test/routes/student-test test/routes/authentication-test
    
    Student
        POST /student 201 114.655 ms - 406
              √ should return confirmation message and update database (133ms)
        POST /student 400 3.321 ms - 425
              √ should return error message when username is already exist
        POST /student 400 2.106 ms - 424
              √ should return error message when email is already exist
            GET /student
        GET /student 200 7.443 ms - 372
              √ should GET all the students
            GET /student/:id
        GET /student/59fdf08dedf9eb26fcf6fdd9 200 2.416 ms - 372
              √ should GET the specific student by id
        GET /student/59fdf08dedf9eb26fcf6fdd91 404 1.978 ms - 289
              √ should return 404 if student is not found
            PUT /student/:id
        PUT /student/59fdf08dedf9eb26fcf6fdd9 200 7.256 ms - 336
              √ should return confirmation message and update student detail
        PUT /student/59fdf08dedf9eb26fcf6fdd91 404 0.801 ms - 289
              √ should return 404 if student is not found
            PUT /student/:id/password
        PUT /student/59fdf08dedf9eb26fcf6fdd9/password 200 154.570 ms - 39
              √ should return confirmation message and update student password (158ms)
        PUT /student/59fdf08dedf9eb26fcf6fdd9/password 400 1.286 ms - 74
              √ should return error message when old password and reenter password is not equal
        PUT /student/59fdf08dedf9eb26fcf6fdd9/password 400 77.208 ms - 33
              √ should return error message when password entered is incorrect (81ms)
        PUT /student/59fdf08dedf9eb26fcf6fdd91/password 404 0.593 ms - 289
              √ should return 404 if student is not found
            POST /student/search
        POST /student/search 200 3.857 ms - 374
              √ should return searched result when value is found
        POST /student/search 404 1.162 ms - 31
              √ should return 404 if student is not found
            DELETE /student/:id
        DELETE /student/59fdf08dedf9eb26fcf6fdd9 200 2.635 ms - 30
              √ should DELETE the specific student by id
        DELETE /student/59fdf08dedf9eb26fcf6fdd91 404 0.613 ms - 289
              √ should return 404 if student is not found

### Authentication

    Authentication
        POST /student 201 80.739 ms - 406
            POST /auth/login
        POST /auth/login 200 80.769 ms - 33
              √ should return successfully login message (116ms)
        POST /auth/login 401 1.690 ms - 66
              √ should return error message when username cannot be found in students collection
        POST /auth/login 401 76.794 ms - 66
              √ should return error message when password is incorrect (81ms)
            GET /auth/logout
        POST /auth/login 200 78.952 ms - 33
        GET /auth/logout 302 2.544 ms - 23
              √ should redirect to index when successfully logout
            Session Checker Middleware
        POST /auth/login 200 81.776 ms - 33
        GET /main 302 0.779 ms - 23
              √ should redirect to index when session inactive
        POST /auth/login 200 80.755 ms - 33
        GET /main 200 1.409 ms - -
              √ should remain the same page when session active
        
        
          22 passing (3s)

## Extra features
+ Mocking with Mockgoose
+ Search function with Fuse.js
+ Session Control with Express session
+ Password Hashing with Bcrypt
+ Supertest integration for API endpoint testing
+ ESLint integration for code style


## References

### Web Application Development Lab

+ [https://ddrohan.github.io/wit-wad/labwall.html](https://ddrohan.github.io/wit-wad/labwall.html)
### Agile Software Development Lab
+ [https://moodle.wit.ie/course/view.php?id=115160&section=5](https://moodle.wit.ie/course/view.php?id=115160&section=5)
### Mongoose password hashing
+ [https://stackoverflow.com/questions/14588032/mongoose-password-hashing](https://stackoverflow.com/questions/14588032/mongoose-password-hashing)
+ [https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1](https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1)
### Manage session and authentication
+ [https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/](https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/)
### Fuse.js Search
+ [http://fusejs.io/](http://fusejs.io/)
### Search check data type
+ [https://www.webbjocke.com/javascript-check-data-types/](https://www.webbjocke.com/javascript-check-data-types/)
### Supertest session
+ [https://github.com/rjz/supertest-session](https://github.com/rjz/supertest-session)
### Mockgoose Tutorial
+ [https://github.com/EnergeticPixels/testingMockgoose/blob/master/test/routes/user_test.js](https://github.com/EnergeticPixels/testingMockgoose/blob/master/test/routes/user_test.js)
+ [https://github.com/mockgoose/mockgoose](https://github.com/mockgoose/mockgoose)
### Supertest 
+ [https://github.com/visionmedia/supertest](https://github.com/visionmedia/supertest)
