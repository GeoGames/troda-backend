var express = require('express');
var ssr = require('./proxy/ssr');
var kulturminner = require('./proxy/kulturminner');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

if (!module.parent) { app.use(express.logger('dev')); }
app.use(express.urlencoded());
app.use(express.json());
app.use(allowCrossDomain);
app.use(app.router);

app.get('/api/finn/:source/', function(req, res, next){
  if(req.params.source === 'kulturminner') {
    if(req.query.bbox) {
      kulturminner.bbox(req.query.bbox, function(err, data) {
        if(err) { return next(err); }
        res.json(data);
      });
    } else if(req.query.name) {
      kulturminner.name(req.query.name, function(err, data) {
        if(err) { return next(err); }
        res.json(data);
      });
    }
  } else if(req.params.source === 'ssr') {
    if(req.query.bbox) {
      ssr.bbox(req.query.bbox, function(err, data) {
        if(err) { return next(err); }
        res.json(data);
      });
    } else if(req.query.name) {
      ssr.name(req.query.name, function(err, data) {
        if(err) { return next(err); }
        res.json(data);
      });
    }
  }
});

var troda = require('./route/troda');

app.get('/api/troda', troda.getTrodas);
app.post('/api/troda', troda.postTroda);
app.param('troda', troda.paramTroda);
app.get('/api/troda/:troda', troda.getTroda);
app.post('/api/troda/:troda/challenge', troda.postChallenge);
app.get('/api/troda/:troda/challenge', troda.getChallenges);
app.param('challenge', troda.paramChallenge);
app.post('/api/troda/:troda/challenge/:challenge/found', troda.foundChallenge);

if (!module.parent) {
  require('./db/mongo').once('ready', function() {
    var port = process.env.PORT_WWW || 8080;
    app.listen(port);
    console.log('Server is listening on port ' + port);
  });
} else {
  module.exports = app;
}

