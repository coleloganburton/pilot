'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Logbook = mongoose.model('Logbook'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, logbook;

/**
 * Logbook routes tests
 */
describe('Logbook CRUD tests', function () {

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

    // Save a user to the test db and create new logbook
    user.save(function () {
      logbook = {
        title: 'Logbook Title',
        content: 'Logbook Content'
      };

      done();
    });
  });

  it('should be able to save an logbook if logged in', function (done) {
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

        // Save a new logbook
        agent.post('/api/logbook')
          .send(logbook)
          .expect(200)
          .end(function (logbookSaveErr, logbookSaveRes) {
            // Handle logbook save error
            if (logbookSaveErr) {
              return done(logbookSaveErr);
            }

            // Get a list of logbook
            agent.get('/api/logbook')
              .end(function (logbookGetErr, logbookGetRes) {
                // Handle logbook save error
                if (logbookGetErr) {
                  return done(logbookGetErr);
                }

                // Get logbook list
                var logbook = logbookGetRes.body;

                // Set assertions
                (logbook[0].user._id).should.equal(userId);
                (logbook[0].title).should.match('Logbook Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an logbook if not logged in', function (done) {
    agent.post('/api/logbook')
      .send(logbook)
      .expect(403)
      .end(function (logbookSaveErr, logbookSaveRes) {
        // Call the assertion callback
        done(logbookSaveErr);
      });
  });

  it('should not be able to save an logbook if no title is provided', function (done) {
    // Invalidate title field
    logbook.title = '';

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

        // Save a new logbook
        agent.post('/api/logbook')
          .send(logbook)
          .expect(400)
          .end(function (logbookSaveErr, logbookSaveRes) {
            // Set message assertion
            (logbookSaveRes.body.message).should.match('Title cannot be blank');

            // Handle logbook save error
            done(logbookSaveErr);
          });
      });
  });

  it('should be able to update an logbook if signed in', function (done) {
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

        // Save a new logbook
        agent.post('/api/logbook')
          .send(logbook)
          .expect(200)
          .end(function (logbookSaveErr, logbookSaveRes) {
            // Handle logbook save error
            if (logbookSaveErr) {
              return done(logbookSaveErr);
            }

            // Update logbook title
            logbook.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing logbook
            agent.put('/api/logbook/' + logbookSaveRes.body._id)
              .send(logbook)
              .expect(200)
              .end(function (logbookUpdateErr, logbookUpdateRes) {
                // Handle logbook update error
                if (logbookUpdateErr) {
                  return done(logbookUpdateErr);
                }

                // Set assertions
                (logbookUpdateRes.body._id).should.equal(logbookSaveRes.body._id);
                (logbookUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of logbook if not signed in', function (done) {
    // Create new logbook model instance
    var logbookObj = new Logbook(logbook);

    // Save the logbook
    logbookObj.save(function () {
      // Request logbook
      request(app).get('/api/logbook')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single logbook if not signed in', function (done) {
    // Create new logbook model instance
    var logbookObj = new Logbook(logbook);

    // Save the logbook
    logbookObj.save(function () {
      request(app).get('/api/logbook/' + logbookObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', logbook.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single logbook with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/logbook/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Logbook is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single logbook which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent logbook
    request(app).get('/api/logbook/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No logbook with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an logbook if signed in', function (done) {
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

        // Save a new logbook
        agent.post('/api/logbook')
          .send(logbook)
          .expect(200)
          .end(function (logbookSaveErr, logbookSaveRes) {
            // Handle logbook save error
            if (logbookSaveErr) {
              return done(logbookSaveErr);
            }

            // Delete an existing logbook
            agent.delete('/api/logbook/' + logbookSaveRes.body._id)
              .send(logbook)
              .expect(200)
              .end(function (logbookDeleteErr, logbookDeleteRes) {
                // Handle logbook error error
                if (logbookDeleteErr) {
                  return done(logbookDeleteErr);
                }

                // Set assertions
                (logbookDeleteRes.body._id).should.equal(logbookSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an logbook if not signed in', function (done) {
    // Set logbook user
    logbook.user = user;

    // Create new logbook model instance
    var logbookObj = new Logbook(logbook);

    // Save the logbook
    logbookObj.save(function () {
      // Try deleting logbook
      request(app).delete('/api/logbook/' + logbookObj._id)
        .expect(403)
        .end(function (logbookDeleteErr, logbookDeleteRes) {
          // Set message assertion
          (logbookDeleteRes.body.message).should.match('User is not authorized');

          // Handle logbook error error
          done(logbookDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Logbook.remove().exec(done);
    });
  });
});
