"use strict";
global.DATABASE_URL = 'mongodb://localhost/musicianship-test';
// const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require('../server');
const request = require('supertest');

const User = require('../app/models/user');

var expect = require('chai').expect;

// chai.use(chaiHttp);

// set up data we need to pass to the login method
const userCredentials = {
  email: 'sponge@bob.com',
  password: 'garyTheSnail'
};

// login user before we run any tests
var authenticatedUser = request.agent(app);

before(function(done){
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function(err, response){
      expect(response.statusCode).to.equal(200);
      //expect('Location', '/home');
      done();
    });
});

describe('GET /profile', function(done) {
  it('should return a 200 response if the user is logged in', function(done) {
    authenticatedUser.get('/profile')
    .expect(200, done);
  });

  it('should return a 302 response and redirect to /login', function(done) {
    request(app).get('/profile')
    .expect('Location', '/login')
    .expect(302, done);
  })
})

// describe('/signup', function() {
//   const email = 'exampleEmail';
//   const password = 'examplePass';
//   const emailB = 'exampleEmailB';
//   const passwordB = 'examplePassB';
//
//   before(function() {
//     return runServer();
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   beforeEach(function() {});
//
//   afterEach(function() {
//     return User.remove({});
//   });
//
//   describe('/signup', function() {
//     describe('POST', function() {
//       it('should create a user', (done) => {
//         var email = 'example@example.com';
//         var password = '123mnb!';
//
//         return chai
//           .request(app)
//           .post('/signup')
//           .send({
//             'email':'example@example.com',
//             'password': '123mnb!'})
//           .then((res) => {
//             expect(res).to.have.status(302);
//             done();
//           })
//
//       })
//     });
//   });
// });
//
// // this function deletes the entire database.
// // we'll call it in an `afterEach` block below
// // to ensure data from one test does not stick
// // around for next one
// function tearDownDb() {
//   return new Promise((resolve, reject) => {
//     console.warn('Deleting database');
//     mongoose.connection.dropDatabase()
//       .then(result => resolve(result))
//       .catch(err => reject(err));
//   });
// }

describe("index page", function() {
  it("should exist", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});
