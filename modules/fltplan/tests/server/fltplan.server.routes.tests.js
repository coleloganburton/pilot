'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  fltplan = mongoose.model('fltplan'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, fltplan;

/**
 * fltplan routes tests
 */
describe('fltplan CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new fltplan
    user.save(function () {
      fltplan = {
        title: 'fltplan Title',
        content: 'fltplan Content'
      };

      done();
    });
  });

  it('should be able to save an fltplan if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fltplan
        agent.post('/api/fltplans')
          .send(fltplan)
          .expect(200)
          .end(function (fltplanSaveErr, fltplanSaveRes) {
            // Handle fltplan save error
            if (fltplanSaveErr) {
              return done(fltplanSaveErr);
            }

            // Get a list of fltplans
            agent.get('/api/fltplans')
              .end(function (fltplansGetErr, fltplansGetRes) {
                // Handle fltplan save error
                if (fltplansGetErr) {
                  return done(fltplansGetErr);
                }

                // Get fltplans list
                var fltplans = fltplansGetRes.body;

                // Set assertions
                (fltplans[0].user._id).should.equal(userId);
                (fltplans[0].title).should.match('fltplan Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an fltplan if not logged in', function (done) {
    agent.post('/api/fltplans')
      .send(fltplan)
      .expect(403)
      .end(function (fltplanSaveErr, fltplanSaveRes) {
        // Call the assertion callback
        done(fltplanSaveErr);
      });
  });

  it('should not be able to save an fltplan if no title is provided', function (done) {
    // Invalidate title field
    fltplan.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fltplan
        agent.post('/api/fltplans')
          .send(fltplan)
          .expect(400)
          .end(function (fltplanSaveErr, fltplanSaveRes) {
            // Set message assertion
            (fltplanSaveRes.body.message).should.match('Title cannot be blank');

            // Handle fltplan save error
            done(fltplanSaveErr);
          });
      });
  });

  it('should be able to update an fltplan if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fltplan
        agent.post('/api/fltplans')
          .send(fltplan)
          .expect(200)
          .end(function (fltplanSaveErr, fltplanSaveRes) {
            // Handle fltplan save error
            if (fltplanSaveErr) {
              return done(fltplanSaveErr);
            }

            // Update fltplan title
            fltplan.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing fltplan
            agent.put('/api/fltplans/' + fltplanSaveRes.body._id)
              .send(fltplan)
              .expect(200)
              .end(function (fltplanUpdateErr, fltplanUpdateRes) {
                // Handle fltplan update error
                if (fltplanUpdateErr) {
                  return done(fltplanUpdateErr);
                }

                // Set assertions
                (fltplanUpdateRes.body._id).should.equal(fltplanSaveRes.body._id);
                (fltplanUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of fltplans if not signed in', function (done) {
    // Create new fltplan model instance
    var fltplanObj = new fltplan(fltplan);

    // Save the fltplan
    fltplanObj.save(function () {
      // Request fltplans
      request(app).get('/api/fltplans')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single fltplan if not signed in', function (done) {
    // Create new fltplan model instance
    var fltplanObj = new fltplan(fltplan);

    // Save the fltplan
    fltplanObj.save(function () {
      request(app).get('/api/fltplans/' + fltplanObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', fltplan.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single fltplan with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fltplans/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'fltplan is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single fltplan which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent fltplan
    request(app).get('/api/fltplans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No fltplan with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an fltplan if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new fltplan
        agent.post('/api/fltplans')
          .send(fltplan)
          .expect(200)
          .end(function (fltplanSaveErr, fltplanSaveRes) {
            // Handle fltplan save error
            if (fltplanSaveErr) {
              return done(fltplanSaveErr);
            }

            // Delete an existing fltplan
            agent.delete('/api/fltplans/' + fltplanSaveRes.body._id)
              .send(fltplan)
              .expect(200)
              .end(function (fltplanDeleteErr, fltplanDeleteRes) {
                // Handle fltplan error error
                if (fltplanDeleteErr) {
                  return done(fltplanDeleteErr);
                }

                // Set assertions
                (fltplanDeleteRes.body._id).should.equal(fltplanSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an fltplan if not signed in', function (done) {
    // Set fltplan user
    fltplan.user = user;

    // Create new fltplan model instance
    var fltplanObj = new fltplan(fltplan);

    // Save the fltplan
    fltplanObj.save(function () {
      // Try deleting fltplan
      request(app).delete('/api/fltplans/' + fltplanObj._id)
        .expect(403)
        .end(function (fltplanDeleteErr, fltplanDeleteRes) {
          // Set message assertion
          (fltplanDeleteRes.body.message).should.match('User is not authorized');

          // Handle fltplan error error
          done(fltplanDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      fltplan.remove().exec(done);
    });
  });
});
