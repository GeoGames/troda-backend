var express = require('express');
var ssr = require('./proxy/ssr');

var app = express();

app.get('/api/finn/:source/', function(req, res, next){
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
});

var troda = require('./route/troda');

app.post('/api/troda/', troda.getList);
app.get('/api/troda/', troda.post);
app.get('/api/troda/:id', troda.get);
app.post('/api/troda/:id/task', troda.postTask);

app.listen(process.env.PORT_WWW || 8080);
