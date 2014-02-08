// Override MongoDB URI
// process.env.MONGO_URI = 'mongodb://localhost:27017/test2'

var app = require('../src/server');
var db = require('../src/db/mongo');
var request = require('supertest');
var assert = require('assert');

var ObjectID = require('mongodb').ObjectID;

var req = null;

var DATA = {
  troda: [{
    _id: new ObjectID('52f5f8742d16451b26b70ded'),
    name: 'Awesome Troda'
  },{
    _id: new ObjectID('52f5f8d52d16451b26b70dee'),
    name: 'Another Troda'
  }],
  challenge: [{
    _id: new ObjectID('52f5f8f82d16451b26b70def'),
    troda: new ObjectID('52f5f8742d16451b26b70ded'),
    type: 'SSR',
    id: 12345,
    geojson: {type: 'Point', coordinates: [1,2]}
  },{
    _id: new ObjectID('52f5f9432d16451b26b70df0'),
    troda: new ObjectID('52f5f8742d16451b26b70ded'),
    type: 'KULTUR',
    id: 'ab235de',
    geojson: {type: 'Point', coordinates: [3,4]}
  },{
    _id: new ObjectID('52f5f95e2d16451b26b70df1'),
    troda: new ObjectID('52f5f8742d16451b26b70ded'),
    type: 'SSR',
    id: 1337,
    geojson: {type: 'Point', coordinates: [5,6]}
  },{
    _id: new ObjectID('52f5f9972d16451b26b70df2'),
    troda: new ObjectID('52f5f8d52d16451b26b70dee'),
    type: 'SSR',
    id: 123452,
    geojson: {type: 'Point', coordinates: [3,4]}
  },{
    _id: new ObjectID('52f5f99e2d16451b26b70df3'),
    troda: new ObjectID('52f5f8d52d16451b26b70dee'),
    type: 'KULTUR',
    id: '22abef2',
    geojson: {type: 'Point', coordiantes: [5,6]}
  }],
  found: [{
    _id: new ObjectID('52f5f99e2d16451b26b70df4'),
    troda: new ObjectID('52f5f8d52d16451b26b70dee'),
    challenge: new ObjectID('52f5f99e2d16451b26b70df3'),
    user: {id: 123, name: 'Hans Kristian'},
    datestamp: 1391853979048
  }]
};

before(function(done) {
  req = request(app);
  db.once('ready', done);
});

beforeEach(function(done) {
  db.db.dropCollection('troda');
  db.db.dropCollection('challenge');
  db.db.dropCollection('found');

  db.troda.insert(DATA.troda, {safe: true}, function(err) {
    assert.ifError(err);
    db.challenge.insert(DATA.challenge, {safe: true}, function(err) {
      assert.ifError(err);
      db.found.insert(DATA.found, {safe: true}, function(err) {
        assert.ifError(err);
        done()
      });
    });
  });
});

describe('GET /api/troda', function() {
  it('should get list of existing trodas', function(done) {
    req.get('/api/troda')
      .expect(200)
      .end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.body.length, 2);
        done();
      });
  });
});

describe('POST /api/troda', function() {
  it('should create new troda', function(done) {
    req.post('/api/troda').send({name: '1'}).expect(200).end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.body.length, 1);
      assert.equal(Object.keys(res.body[0]).length, 2);
      assert.equal(typeof res.body[0]._id, 'string');
      assert.equal(res.body[0].name, '1');
      // @TODO(starefossen) assert databse
      done();
    });
  });
});

describe('GET /api/troda/:troda', function() {
  it('should get existing Troda', function(done) {
    req.get('/api/troda/52f5f8742d16451b26b70ded')
      .expect(200)
      .end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.body._id, '52f5f8742d16451b26b70ded');
        assert.equal(res.body.name, 'Awesome Troda');
        done();
      });
  });
});

describe('POST /api/troda/:troda/challenge', function() {
  it('should create new Troda challenge', function(done) {
    var challenge = {
      type: 'SSR',
      id: 1234,
      geojson: {type: 'Point', coordinates: [1,2]}
    };

    req.post('/api/troda/52f5f8d52d16451b26b70dee/challenge')
      .send(challenge)
      .expect(200)
      .end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.body.length, 1);
        assert.equal(Object.keys(res.body[0]).length, 5);
        assert.equal(typeof res.body[0]._id, 'string');
        assert.equal(res.body[0].troda, '52f5f8d52d16451b26b70dee');
        assert.equal(res.body[0].type, challenge.type);
        assert.equal(res.body[0].id, challenge.id);
        assert.deepEqual(res.body[0].geojson, challenge.geojson);
        done();
      });
  });
});

