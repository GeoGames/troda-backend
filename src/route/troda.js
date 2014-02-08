var db = require('./../db/mongo');

exports.getTrodas = function(req, res, next) {
  db.troda.find().toArray(function(err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
};

exports.postTroda = function(req, res, next) {
  if (typeof req.body === 'undefined') {
    return res.jsonp({error: 'No body defined'});
  }

  if (typeof req.body !== 'object') {
    return res.jsonp({error: 'Body must be JSON'});
  }

  db.troda.insert(req.body, {safe: true}, function(err, doc) {
    if (err) return next(err);
    res.jsonp(doc);
  });
};

exports.getTroda = function(req, res, next) {
  res.json({foo: 'bar'});
};

exports.postTask = function(req, res, next) {
  res.json({foo: 'bar'});
};

exports.getTasks = function(req, res, next) {
  res.json({foo: 'bar'});
};

