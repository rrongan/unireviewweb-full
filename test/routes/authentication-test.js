var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
process.env.NODE_ENV = 'testing';
var app = require('../../app');

var mongoose = require('mongoose');

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('Authentication', function () {
    this.timeout(120000);
    before(function(done) {
        mockgoose.prepareStorage().then(function() {
            mongoose.connect('mongodb://localhost:27017/unireviewdb', function(err) {
                if(err) return err;
            });
        });

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
                done();
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

    describe('POST /auth/login', function () {
        it('should return successfully login message', function(done) {
            var login = {
                username: "tempstudent",
                password: "tempstudent00"
            };
            request(app)
                .post('/auth/login')
                .send(login)
                .expect(200)
                .end(function (err, res) {
                    if(err) return done(err);
                    expect(res.body).to.have.property('message').equal('Successfully Login!' ) ;
                    done();
                });
        });
        it('should return error message when username cannot be found in students collection', function(done) {
            var login = {
                username: "tempstudent1",
                password: "tempstudent00"
            };
            request(app)
                .post('/auth/login')
                .send(login)
                .expect(401)
                .end(function (err, res) {
                    if(err) return done(err);
                    expect(res.body).to.have.property('message').equal('Authentication Failed. Invalid Username or Password!' ) ;
                    done();
                });
        });
        it('should return error message when password is incorrect', function(done) {
            var login = {
                username: "tempstudent",
                password: "tempstudent01"
            };
            request(app)
                .post('/auth/login')
                .send(login)
                .expect(401)
                .end(function (err, res) {
                    if(err) return done(err);
                    expect(res.body).to.have.property('message').equal('Authentication Failed. Invalid Username or Password!' ) ;
                    done();
                });
        });
    });

    describe('GET /auth/logout', function () {
        it('should redirect to index when successfully logout', function (done) {
            request(app)
                .get('/auth/logout')
                .expect(302)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect('Location','/');
                    done();
                });
        });
    });
});