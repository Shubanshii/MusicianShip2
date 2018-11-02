"use strict";
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const bcrypt = require('bcrypt-nodejs');

const User = require('../app/models/user');
const Campaign = require('../app/models/campaign');
const { PORT, TEST_DATABASE_URL } = require('../config/database');

const expect = chai.expect;

chai.use(chaiHttp);

describe('MusicianShip', function() {
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

  const campaign = {
    artist: "Red Hot Chili Peppers",
    title: "Flea and Chad Uber Jam",
    description: "Flea and Chad jamming.  Become the John Frusciante!!!",
    financialGoal: 145,
    files: "data:application/octet-stream;base64,Cg=="
  }

  const badCampaign = {
    title: "Flea and Chad Uber Jam",
    description: "Flea and Chad jamming.  Become the John Frusciante!!!",
    financialGoal: 145,
    files: "data:application/octet-stream;base64,Cg=="
  }

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });



  describe('initial rejections', function() {
    it('should not get profile if not logged in', function() {
      return chai
        .request(app)
        .get('/profile')
        .then((res) => {
          expect(res.text).to.include('Login or Register');
          expect(res.redirects[0]).to.not.include('/profile');
          expect(res.redirects[0].length > 1).to.be.true;
        })
    });

    it('should reject users with invalid email', function() {
      return chai
        .request(app)
        .post("/signup")
        .send(badEmailCredentials)
        .then((res) => {
          User.findOne({ 'local.email': badEmailCredentials.email }, function(err, user) {
            expect(user).to.equal(null);
          });
          expect(res.redirects[0]).to.include('/signup');
        });
    });

    it('should reject users with invalid password', function() {
      return chai
        .request(app)
        .post("/signup")
        .send(badPasswordCredentials)
        .then((res) => {
          User.findOne({ 'local.email': badPasswordCredentials.email }, function(err, user) {
            expect(user).to.equal(null);
          });
          expect(res.redirects[0]).to.include('/signup');
        });
    });
  });


  describe('sign up and routes that follow', function() {
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
              expect(res.text).to.include('Would you like to start a campaign?')
              expect(res.redirects[0]).to.equal(undefined);
              chai.request(app).get('/logout');
              return User.remove({'local.email': userCredentials.email});
            });
        })
    });

    it('should post campaign', function() {
      return agent
        .post('/signup')
        .send(userCredentials)
        .then(() => {
          return agent
            .post('/campaigns')
            .send(campaign)
            .then((res) => {
              console.log(res);
              User.findById(res.body.user, function(err, user) {
                console.log(user);
                expect(user.local.email).to.equal(userCredentials.email);
              })
              expect(res.body.artist).to.equal(campaign.artist);
              expect(res.body.title).to.equal(campaign.title);
              expect(res.body.description).to.equal(campaign.description);
              expect(res.body.financialGoal).to.equal(campaign.financialGoal);
              expect(res.body.files).to.equal(campaign.files);
              chai.request(app).get('/logout');
              return User.remove({'local.email': userCredentials.email});
            });
        })
    });
    it("should not post campaign if it's missing a required field", function() {
      return agent
        .post('/signup')
        .send(userCredentials)
        .then(() => {
          return agent
            .post('/campaigns')
            .send(badCampaign)
            .then((res) => {
              expect(res.status).to.equal(400);
              expect(res.text).to.equal('Missing `artist` in request body');

              chai.request(app).get('/logout');
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
