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
        "_id": "59ff66f3890a7f3f40259ffd",
        "address": "2 temproad, tempplace",
        "gender": "Male",
        "dob": "1995-08-23T00:00:00.000Z",
        "email": "rrongan@gmail.com",
        "name": "Yun Shen Tan",
        "studentid": "20065126",
        "password": "$2a$10$WBOJ1mQbtLX2mLMzt3lXmO15uU3OJ99ZHhzYLk6IMYrDb9iFHiday",
        "username": "yunshen",
        "__v": 0,
        "college": {
            "name": "Waterford Institute of Technology",
            "course": {
                "year": 4,
                "name": "BSc (H) in Software System Development"
            }
        }
    }
````

## Sample Test Execution
There are two kinds of test in in this project, __Integration Test__ and __Unit Test__. Both of the tests have two 
 test suites, __Authentication__ and __Student__. All the tests can be run in single 
command `npm test`.The section below include a listing of 
the output from running the test suites.

### Student Model Unit Test

    Student Model Unit
    Student Schema
        √ should create a student
        √ should return error if email not available
        √ should return error if username not available
        √ should return error if password not available
        √ should return error if email format is incorrect
        √ should return error if gender is not in correct form
    Schema Custom Validator
        √ should return error if email is existed (90ms)
        √ should return error if username is existed (81ms)
    Save, Update and Compare Encrypted Password
        √ should encrypt the password after student is saved (84ms)
        √ should be able to update the password (162ms)
        √ should match the password with the saved password (155ms)


### Student Unit Test

    Student Unit
    
    POST /student
        POST /student 201 94.266 ms - 456
              √ should return confirmation message and update database (110ms)
        POST /student 400 2.226 ms - 427
              √ should return error message when username is already exist
        POST /student 400 1.760 ms - 426
              √ should return error message when email is already exist
        POST /student 400 1.437 ms - 445
              √ should return error message when email format is incorrect
        POST /student 400 1.705 ms - 513
              √ should return error message when gender is not in correct form
    GET /student
        GET /student 200 3.101 ms - 425
              √ should GET all the students
            GET /student/:id
        GET /student/59ff6808755d742a4ceabf86 200 1.583 ms - 425
              √ should GET the specific student by id
        GET /student/59ff6808755d742a4ceabf861 404 1.635 ms - 289
              √ should return 404 if student is not found
    PUT /student/:id
        PUT /student/59ff6808755d742a4ceabf88 200 4.562 ms - 386
              √ should return confirmation message and update student detail
        PUT /student/59ff6808755d742a4ceabf881 404 0.769 ms - 289
              √ should return 404 if student is not found
    PUT /student/:id/password
        PUT /student/59ff6808755d742a4ceabf8a/password 200 153.888 ms - 39
              √ should return confirmation message and update student password (159ms)
        PUT /student/59ff6808755d742a4ceabf8b/password 400 1.103 ms - 74
              √ should return error message when old password and reenter password is not equal
        PUT /student/59ff6808755d742a4ceabf8c/password 400 77.950 ms - 33
              √ should return error message when password entered is incorrect (82ms)
        PUT /student/59ff6809755d742a4ceabf8d1/password 404 0.581 ms - 289
              √ should return 404 if student is not found
    POST /student/search
        POST /student/search 200 3.596 ms - 425
              √ should return searched result when value is found
        POST /student/search 404 1.233 ms - 31
              √ should return 404 if student is not found
    DELETE /student/:id
        DELETE /student/59ff6809755d742a4ceabf90 200 2.364 ms - 30
              √ should DELETE the specific student by id
        DELETE /student/59ff6809755d742a4ceabf911 404 0.458 ms - 289
              √ should return 404 if student is not found
    
    
      29 passing (6s)
    
    -----------------------------|----------|----------|----------|----------|----------------|
    File                         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
    -----------------------------|----------|----------|----------|----------|----------------|
    All files                    |    74.89 |    47.96 |    69.77 |    76.86 |                |
     unireviewweb-backend        |    77.27 |        0 |        0 |    77.27 |                |
      app.js                     |    77.27 |        0 |        0 |    77.27 |... 71,76,77,79 |
     unireviewweb-backend/models |    82.22 |    55.56 |      100 |    94.87 |                |
      student.js                 |    82.22 |    55.56 |      100 |    94.87 |          36,45 |
     unireviewweb-backend/routes |    71.92 |    51.39 |    62.96 |    71.92 |                |
      authentication.js          |    25.93 |        0 |        0 |    25.93 |... 36,42,43,45 |
      index.js                   |       80 |      100 |        0 |       80 |              6 |
      main.js                    |       40 |        0 |        0 |       40 |  6,7,8,9,11,12 |
      student.js                 |    86.54 |    66.07 |    89.47 |    86.54 |... 151,163,172 |
    -----------------------------|----------|----------|----------|----------|----------------|

### Authentication Unit Test

    Authentication Unit
    
    POST /auth/login
        POST /auth/login 200 96.735 ms - 33
              √ should return successfully login message (115ms)
        POST /auth/login 401 1.824 ms - 66
              √ should return error message when username cannot be found in students collection
        POST /auth/login 401 76.621 ms - 66
              √ should return error message when password is incorrect (80ms)
    GET /auth/logout
        POST /auth/login 200 76.888 ms - 33
        GET /auth/logout 302 2.669 ms - 23
              √ should redirect to index when successfully logout
    Session Checker Middleware
        POST /auth/login 200 76.128 ms - 33
        GET /main 302 0.683 ms - 23
              √ should redirect to index when session inactive
    
    
      5 passing (3s)
    
    -----------------------------|----------|----------|----------|----------|----------------|
    File                         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
    -----------------------------|----------|----------|----------|----------|----------------|
    All files                    |    45.53 |    17.35 |    37.21 |    46.72 |                |
     unireviewweb-backend        |    77.27 |        0 |        0 |    77.27 |                |
      app.js                     |    77.27 |        0 |        0 |    77.27 |... 71,76,77,79 |
     unireviewweb-backend/models |    62.22 |    33.33 |    76.92 |    71.79 |                |
      student.js                 |    62.22 |    33.33 |    76.92 |    71.79 |... 81,84,85,89 |
     unireviewweb-backend/routes |    30.82 |    15.28 |    22.22 |    30.82 |                |
      authentication.js          |    85.19 |    71.43 |      100 |    85.19 |    13,17,34,43 |
      index.js                   |       80 |      100 |        0 |       80 |              6 |
      main.js                    |       40 |        0 |        0 |       40 |  6,7,8,9,11,12 |
      student.js                 |    13.46 |     1.79 |        0 |    13.46 |... 182,183,185 |
    -----------------------------|----------|----------|----------|----------|----------------|
    
### Student Integration Test
    
    Student
    
    POST /student
        POST /student 201 83.369 ms - 456
              √ should return confirmation message and update database (92ms)
        POST /student 400 2.595 ms - 425
              √ should return error message when username is already exist
        POST /student 400 1.852 ms - 424
              √ should return error message when email is already exist
        POST /student 400 1.600 ms - 443
              √ should return error message when email format is incorrect
        POST /student 400 1.652 ms - 513
              √ should return error message when gender is not in correct form
    GET /student
        GET /student 200 3.015 ms - 422
              √ should GET all the students
            GET /student/:id
        GET /student/59ff681520831a4b289dfcb9 200 1.957 ms - 422
              √ should GET the specific student by id
        GET /student/59ff681520831a4b289dfcb91 404 1.819 ms - 289
              √ should return 404 if student is not found
            PUT /student/:id
        PUT /student/59ff681520831a4b289dfcb9 200 6.633 ms - 386
              √ should return confirmation message and update student detail
        PUT /student/59ff681520831a4b289dfcb91 404 0.743 ms - 289
              √ should return 404 if student is not found
    PUT /student/:id/password
        PUT /student/59ff681520831a4b289dfcb9/password 200 160.152 ms - 39
              √ should return confirmation message and update student password (164ms)
        PUT /student/59ff681520831a4b289dfcb9/password 400 1.289 ms - 74
              √ should return error message when old password and reenter password is not equal
        PUT /student/59ff681520831a4b289dfcb9/password 400 78.938 ms - 33
              √ should return error message when password entered is incorrect (87ms)
        PUT /student/59ff681520831a4b289dfcb91/password 404 0.628 ms - 289
              √ should return 404 if student is not found
    POST /student/search
        POST /student/search 200 4.273 ms - 424
              √ should return searched result when value is found
        POST /student/search 404 1.400 ms - 31
              √ should return 404 if student is not found
            DELETE /student/:id
        DELETE /student/59ff681520831a4b289dfcb9 200 2.680 ms - 30
              √ should DELETE the specific student by id
        DELETE /student/59ff681520831a4b289dfcb91 404 0.503 ms - 289
              √ should return 404 if student is not found
    
    
      24 passing (5s)

### Authentication Integration Test

    Authentication
    
        POST /student 201 1855.619 ms - 406
    POST /auth/login
        POST /auth/login 200 84.324 ms - 33
              √ should return successfully login message (95ms)
        POST /auth/login 401 1.757 ms - 66
              √ should return error message when username cannot be found in students collection
        POST /auth/login 401 81.598 ms - 66
              √ should return error message when password is incorrect (92ms)
    GET /auth/logout
        POST /auth/login 200 78.243 ms - 33
        GET /auth/logout 302 2.977 ms - 23
              √ should redirect to index when successfully logout
    Session Checker Middleware
        POST /auth/login 200 79.265 ms - 33
        GET /main 302 0.711 ms - 23
             √ should redirect to index when session inactive
        POST /auth/login 200 77.109 ms - 33
        GET /main 200 0.638 ms - -
              √ should remain the same page when session active
    
    -----------------------------|----------|----------|----------|----------|----------------|
    File                         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
    -----------------------------|----------|----------|----------|----------|----------------|
    All files                    |    83.83 |     60.2 |    86.05 |    86.03 |                |
     unireviewweb-backend        |    77.27 |        0 |        0 |    77.27 |                |
      app.js                     |    77.27 |        0 |        0 |    77.27 |... 71,76,77,79 |
     unireviewweb-backend/models |    82.22 |    55.56 |      100 |    94.87 |                |
      student.js                 |    82.22 |    55.56 |      100 |    94.87 |          36,45 |
     unireviewweb-backend/routes |     86.3 |    68.06 |    88.89 |     86.3 |                |
      authentication.js          |    88.89 |    78.57 |      100 |    88.89 |       13,17,34 |
      index.js                   |       80 |      100 |        0 |       80 |              6 |
      main.js                    |       80 |       50 |      100 |       80 |          11,12 |
      student.js                 |    86.54 |    66.07 |    89.47 |    86.54 |... 151,163,172 |
    -----------------------------|----------|----------|----------|----------|----------------|


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
