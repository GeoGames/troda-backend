var db = require('./../db/mongo');

exports.getList = function(req, res, next) {
  db.troda.find().toArray(function(err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
};

exports.post = function(req, res, next) {
  res.json({foo: 'bar'});
};

exports.get = function(req, res, next) {
  res.json({foo: 'bar'});
};

exports.postTask = function(req, res, next) {
  res.json({foo: 'bar'});
};
