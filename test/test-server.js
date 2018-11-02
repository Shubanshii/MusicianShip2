"use strict";
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const bcrypt = require('bcrypt-nodejs');

const User = require('../app/models/user');
const { PORT, TEST_DATABASE_URL } = require('../config/database');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Signing up, protected routes, etc.', function() {
  const userCredentials = {
    email: 'sponge@bob.com',
    password: 'garyTheSnail'
  };

  const badEmailCredentials = {
    email: 'spongebob.com',
    password: 'garyTheSnail'
  };

  const badPasswordCredentials = {
    email: 'sponge1@bob1.com',
    password: 'g'
  };

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  it('should not get profile if not logged in', function() {
    return chai
      .request(app)
      .get('/profile')
      .then((res) => {
        expect(res.text).to.include('Login or Register');
        expect(res.redirects).to.not.include('/profile');
      })
  });

  it('should reject users with invalid email', function() {
    return chai
      .request(app)
      .post("/signup")
      .send(badEmailCredentials)
      .then(() => {
        User.findOne({ 'local.email': badEmailCredentials.email }, function(err, user) {
          expect(user).to.equal(null);
        });
      });
  });

  it('should reject users with invalid password', function() {
    return chai
      .request(app)
      .post("/signup")
      .send(badPasswordCredentials)
      .then(() => {
        User.findOne({ 'local.email': badPasswordCredentials.email }, function(err, user) {
          expect(user).to.equal(null);
        });
      });
  });

  describe('sign up and get profile', function() {
    var agent = chai.request.agent(app);
    it('should sign up users with valid email and password', function() {
      return agent
        .post('/signup')
        .send(userCredentials)
        .then((res) => {
          User.findOne({ 'local.email': userCredentials.email }, function(err, user) {
            if (user) {
              expect(user.local.email).to.equal(userCredentials.email);
            }
          });
          expect(res.redirects[0]).to.include('/profile');
          chai.request(app).get('/logout');
          return User.remove({'local.email': userCredentials.email});
        })
    });
    it('should get profile if user signed up correctly', function() {
      return agent
        .post('/signup')
        .send(userCredentials)
        .then(() => {
          return agent
            .get('/profile')
            .then((res) => {
              return User.remove({'local.email': userCredentials.email});
            });
        })
    });
  });




});

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

//let's set up the data we need to pass to the login method
// describe('protected routes', function() {
//   const userCredentials = {
//     email: 'sponge@bob.com',
//     password: 'garyTheSnail'
//   }
//
//   before(function () {
//       return runServer(TEST_DATABASE_URL);
//   });
//
//   after(function () {
//     return closeServer();
//   });
//
//   beforeEach(function() {
//     return chai
//       .request(app)
//       .get("/signup")
//       .then(() => {
//         return chai
//           .request(app)
//           .post("/signup")
//           .send(userCredentials)
//       })
//
//
//       // .then(function(res) {
//       //
//       // })
//   });
//
//   afterEach(function () {
//     return User.remove({'local.email': 'sponge@bob.com'});
//   });
//
//   describe('/profile', function(res) {
//     it('Should send protected data', function(res) {
//
//       // return chai
//       //   .request(app)
//       //   .get('/profile')
//       //   .then(res => {
//       //     console.log(res.text);
//       //     expect(res).to.have.status(200);
//       //     expect(res.body).to.be.an('object');
//       //     expect(res.text).to.be.a('string');
//       //     // expect(res.text).to.include('Would you like to start a campaign?');
//       //   });
//     });
//     // it('Should reject requests with no credentials', function() {
//     //   return chai
//     //     .request(app)
//     //     .get('/logout')
//     //     .then(res => {
//     //       expect(res).to.have.status(200);
//     //       ex
//     //     })
//     //     // .get('/profile')
//     //     // .then(res => {
//     //     //   expect(res).to.have.status(200);
//     //     //   expect(res.body).to.be.an('object');
//     //     //   expect(res.text).to.be.a('string');
//     //     //   expect(res.text).to.include('<!DOCTYPE html>');
//     //     // });
//     // });
//   });
// })
