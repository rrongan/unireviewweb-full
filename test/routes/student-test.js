/*
* Mockgoose Tutorial https://github.com/EnergeticPixels/testingMockgoose/blob/master/test/routes/user_test.js
*                    https://github.com/mockgoose/mockgoose
* */

var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../app');

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var _ = require('lodash' );

describe('Student', function () {
    before(function(done) {
        this.timeout(120000);
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
            mongoose.connection.close( done );
        }).then(() => {
            done()
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
                            password: student.password,
                            email: student.email
                        };
                    });
                    done();
                });
        });
    });
});
