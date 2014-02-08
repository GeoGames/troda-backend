var ObjectID = require('mongodb').ObjectID
var db = require('./../db/mongo');

exports.getTrodas = function(req, res, next) {
  db.troda.find().toArray(function(err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
};

exports.postTroda = function(req, res, next) {
  if (typeof req.body === 'undefined') {
    return res.jsonp(400, {error: 'No body defined'});
  }

  if (typeof req.body !== 'object') {
    return res.jsonp(400, {error: 'Body must be JSON'});
  }

  if (!req.body.name) {
    return res.jsonp(400, {error: 'Body must contain "name"'});
  }

  db.troda.insert(req.body, {safe: true}, function(err, doc) {
    if (err) return next(err);
    res.jsonp(doc);
  });
};

exports.paramTroda = function(req, res, next, id) {
  if (!/[0-9a-f]{24}/.test(id)) return res.json(400, {error: 'Invalid Troda ID'});
  db.troda.findOne({_id: new ObjectID(id)}, function(err, doc) {
    if (err) return next(err);
    if (!doc) return res.jsonp(404, {error: 'Troda Not Found'});
    res.troda = doc;
    next();
  });
};

exports.getTroda = function(req, res, next) {
  res.json(res.troda);
};

exports.postChallenge = function(req, res, next) {
  if (typeof req.body === 'undefined') {
    return res.jsonp(400, {error: 'No body defined'});
  }

  if (typeof req.body !== 'object') {
    return res.jsonp(400, {error: 'Body must be JSON'});
  }

  if (!req.body.type || !req.body.id || !req.body.geojson) {
    return res.jsonp(400, {error: 'Body must contain "type", "id" and "geojson"'});
  }

  req.body.troda = res.troda._id
  db.challenge.insert(req.body, {safe: true}, function(err, doc) {
    if (err) return next(err);
    res.jsonp(doc);
  });
};

exports.getChallenges = function(req, res, next) {
  db.challenge.find({troda: res.troda._id}).toArray(function(err, docs) {
    if (err) return next(err);
    res.jsonp(docs);
  });
};

exports.paramChallenge = function(req, res, next, id) {
  if (!/[0-9a-f]{24}/.test(id)) return res.json({error: 'Invalid Challenge ID'});
  db.challenge.findOne({_id: new ObjectID(id)}, function(err, doc) {
    if (err) return next(err);
    if (!doc) return res.jsonp(404, {error: 'Challenge Not Found'});
    res.challenge = doc;
    next();
  });
};

exports.foundChallenge = function(req, res, next) {
  if (typeof req.body === 'undefined') {
    return res.jsonp({error: 'No body defined'});
  }

  if (typeof req.body !== 'object') {
    return res.jsonp({error: 'Body must be JSON'});
  }

  if (typeof req.body.user !== 'object') {
    return res.jsonp({error: 'Body must contain a "user" object'});
  }

  doc = {
    troda: res.troda._id,
    challenge: res.challenge._id,
    user: req.body.user,
    timestamp: new Date().toTime()
  }

  db.found.insert(doc, {safe: true}, function(err, doc) {
    if (err) return next(err);
    res.jsonp(doc);
  });
}

