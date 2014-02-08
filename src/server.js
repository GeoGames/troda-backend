var express = require('express');
var ssr = require('./proxy/ssr');

var app = express();
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.json());

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

app.get('/api/troda', troda.getList);
app.post('/api/troda', troda.post);
app.get('/api/troda/:troda', troda.get);
app.post('/api/troda/:troda/task', troda.postTask);
app.get('/api/troda/:troda/tasks', troda.getTasks);

require('./db/mongo').once('ready', function() {
  var port = process.env.PORT_WWW || 8080;
  app.listen(port);
  console.log('Server is listening on port ' + port);
});

