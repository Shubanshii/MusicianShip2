'use strict';

module.exports = function(app, passport) {
  const User = require('./models/user');
  const Contribution = require('./models/contribution');
  const Campaign = require('./models/campaign');

  //HOME PAGE
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  //login
  app.get('/login', function(req, res) {
    //render login page and pass in flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  var authenticationHandler = passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  });
  // process the login form
  app.post('/login', function(req, res) {
    authenticationHandler(req, res);
  });

  // SIGNUP
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {message: req.flash('signupMessage') });
  });

  //process the signup form
  app.post('/signup', passport.authenticate('local-signup', {

    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // PROFILE SECTION
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    // console.log('profile route request', req);
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  // LOGOUT

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })

  // GET CREATE CAMPAIGN PAGE

  app.get('/campaign', isLoggedIn, function(req, res) {
    // res.render('campaign.ejs', {
    //   user: req.user // get the user out of session and pass to template
    // });
    res.render('campaign.ejs');
  });

  // ROUTE TO CREATE CAMPAIGN

  app.post('/campaigns', isLoggedIn, (req, res) => {
    const requiredFields = ['artist', 'title', 'description', 'financialGoal'];
    // console.log(req.session.passport.user);
    User
      .find()
      .then(user => {
        // console.log(user);
      })
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }

    Campaign
      .create({
        id: req.body._id,
        artist: req.body.artist,
        title: req.body.title,
        description: req.body.description,
        files: req.body.files,
        contributions: req.body.contributions,
        user: req.session.passport.user,
        financialGoal: req.body.financialGoal,
        status: req.body.status,
        createdAt: req.body.createdAt})
      .then(
        campaign => res.status(201).json(campaign.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });



//   app.patch('/campaigns/:id', isLoggedIn, (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }
//
//   const updated = {};
//   const updateableFields = ['financialGoal'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });
//
//   Campaign
//     .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
//     .then(updatedCampaign => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Something went wrong' }));
// });

  // GET PAGE FOR REQUESTED CAMPAIGN

  app.get('/campaigns/:id', isLoggedIn, (req, res) => {

    // console.log(res);
    Campaign
      .findById(req.params.id)
      .then(campaign => {
        // console.log(campaign);
        res.render('contribute', campaign);
      })
      .catch(err => {
        console.error(err);
          res.status(500).json({message: 'Internal server error'})
      });
  });

  // DELETE CAMPAIGN.  USER WHO CREATED CAMPAIGN CAN ONLY DELETE.
  // MUST HAVE ZERO CONTRIBUTIONS OR BE A FINISHED CAMPAIGN.

  // test without isLoggedIn
  // app.delete('/campaigns/:id', (req, res) => {
  //   // console.log(req.params.id);
  //   Campaign
  //     .findByIdAndRemove(req.params.id)
  //     .then(() => {
  //       res.status(204).json({ message: 'success' });
  //     })
  // })

  app.delete('/campaigns/:id', isLoggedIn, (req, res) => {
    // console.log('user', req.session);
    // console.log(req.params.id);
    Campaign.findById(req.params.id)
      .then(campaign => {
        // console.log('user', req.session.passport.user);
        // console.log('also user', campaign.user);
        // console.log(typeof req.session.passport.user);
        // console.log(typeof campaign.user);
        // console.log(campaign.user == req.session.passport.user);
        if (campaign.user != req.session.passport.user) {
          res.status(401).json({message: 'This project is not yours'});
        } else {
          Campaign
            .findByIdAndRemove(req.params.id)
            .then(() => {
              res.status(204).json({ message: 'success' });
            })
        }
      })

  })

  // GET FINANICAL GOAL
  app.get('/financialgoal/:id', isLoggedIn, (req, res) => {
    Campaign
      .findById(req.params.id)
      .then(campaign => {
        // console.log('financialgoal log', campaign);
        res.json({
        id: campaign._id,
        artist: campaign.artist,
        title: campaign.title,
        description: campaign.description,
        files: campaign.files,
        user: campaign.user,
        financialGoal: campaign.financialGoal,
        contributions: campaign.contributions
      });
      }).catch(err => {
        console.error(err);
          res.status(500).json({message: 'Internal server error'})
      });
  });

  app.post('/contributions', isLoggedIn, (req, res) => {
    const requiredFields = ['amount'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }

    // console.log('sd0f9dslflsdkjf23423423424234234324', req.session.passport.user);

    Contribution
      .create({
        id: req.body._id,
        amount: req.body.amount,
        user: req.session.passport.user
      })
      .then(
        contribution => {

          return Campaign.findByIdAndUpdate(req.body.campaignId, {
            $push: {
              contributions: contribution._id
            }
          }, {
            new: true
          })
        })
        .then(
          campaign => {
            res.status(201).json(campaign.serialize());
          }
        )
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't authenticated, redirect them to the home PAGE
  res.redirect('/');

}
