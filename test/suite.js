var app = require('../src/server');
var db = require('../src/db/mongo');
var request = require('supertest');
var assert = require('assert');

var req = null;

before(function(done) {
  req = request(app);
  db.once('ready', done);
});

beforeEach(function() {
  db.db.dropCollection('troda');
});

describe('/api', function() {
  describe('/troda', function() {
    it('should do shit', function(done) {
      req.get('/api/troda').expect(200, done);
    });
  });
});

