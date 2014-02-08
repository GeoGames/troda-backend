var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient;
var inherits = require('util').inherits;

var Mongo = function(uri) {
  EventEmitter.call(this);

  $this = this

  MongoClient.connect(uri, function(err, database) {
    if (err) throw err;

    $this.db = database;
    $this.troda = $this.db.collection('troda');
    $this.challenge = $this.db.collection('challenge');
    $this.found = $this.db.collection('found');

    $this.emit('ready');
  });

  return this
};

inherits(Mongo, EventEmitter);

module.exports = new Mongo(process.env.MONGO_URI);

