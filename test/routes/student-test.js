/*
* Mockgoose Tutorial https://github.com/EnergeticPixels/testingMockgoose/blob/master/test/routes/user_test.js
*                    https://github.com/mockgoose/mockgoose
* */

var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
process.env.NODE_ENV = 'testing';
var app = require('../../app');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('Student', function () {
    this.timeout(120000);
    before(function(done) {
        mockgoose.prepareStorage().then(function() {
            mongoose.connect('mongodb://localhost:27017/unireviewdb', function(err) {
                done(err);
            });
        });
    });

    after( (done) => {
        Object.keys( mongoose.connection.collections ).forEach( col => {
            delete mongoose.connection.models[col];
        } );

        mockgoose.helper.reset( function ( ) {
            mongoose.disconnect();
        }).then(() => {
            done()
        });
    });

    describe('POST /student',function () {
        it('should return confirmation message and update database', function(done) {
            var tempstudent = {
                dob:"2000-01-01",
                name:"Temp Student",
                studentid:20010001,
                email:"tempstudent@gmail.com",
                username:"tempstudent",
                password:"tempstudent00",
                college:{
                    name:"Waterford Institute of Technology",
                    course:{
                        year:2,
                        name:"BSc in Software System Development"
                    }
                }
            };
            request(app)
                .post('/student')
                .send(tempstudent)
                .expect(201)
                .end(function (err, res) {
                    if(err) return done(err);
                    expect(res.body).to.have.property('message').equal('Student Added!' ) ;
                    done();
                });
        });
    });

    describe('GET /student', function () {
        it('should GET all the donations', function(done) {
            request(app)
                .get('/student')
                .expect(200)
                .end(function (err, res) {
                    if(err) return done(err);
                    expect(res.body).to.be.a('array');
                    var result = _.map(res.body, function (student) {
                        return {
                            studentid: student.studentid,
                            name: student.name,
                            username: student.username,
                            email: student.email
                        };
                    });
                    done();
                });
        });
    });
});
