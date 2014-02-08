// Override MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/test2'

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

describe('GET /api/troda', function() {
  it('should get list of existing trodas', function(done) {
    db.troda.insert([{foo: 'bar'}, {bar: 'foo'}], {safe: true}, function(err, docs) {
      assert.ifError(err);
      req.get('/api/troda').expect(200).end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.body.length, 2);
        assert.equal(Object.keys(res.body[0]).length, 2);
        assert.equal(typeof res.body[0]._id, 'string');
        assert.equal(typeof res.body[1]._id, 'string');
        assert.equal(res.body[0].foo, 'bar');
        assert.equal(res.body[1].bar, 'foo');
        done();
      });
    });
  });
});

describe('POST /api/troda', function() {
  it('should create new troda', function(done) {
    req.post('/api/troda').send({foo: 'bar'}).expect(200).end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.body.length, 1);
      assert.equal(Object.keys(res.body[0]).length, 2);
      assert.equal(typeof res.body[0]._id, 'string');
      assert.equal(res.body[0].foo, 'bar');
      done();
    });
  });
});

describe('GET /api/troda/:troda', function() {
  it('should get existing troda', function(done) {
    db.troda.insert({foo: 'bar'}, {safe: true}, function(err, docs) {
      assert.ifError(err);
      docs[0]._id = docs[0]._id.toString();
      req.get('/api/troda/' + docs[0]._id).expect(200).end(function(err, res) {
        assert.ifError(err);
        assert.deepEqual(res.body, docs[0]);
        done();
      });
    });
  });
});

