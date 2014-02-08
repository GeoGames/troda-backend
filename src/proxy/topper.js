var request = require('request');
var mongo = require('../db/mongo');

exports.bbox = function(bbox, cb) {
    bbox = bbox.split(',');
    bbox = bbox.map(function(i) { return parseFloat(i); });

    var geojson = {
        '$geoWithin': {
            '$geometry': {
                type: 'Polygon',
                coordinates: [[
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[1]],
                    [bbox[2], bbox[3]],
                    [bbox[0], bbox[3]],
                    [bbox[0], bbox[1]],
                ]]
            }
        }
    };

    mongo.db.collection('topper').find({geojson: geojson}).toArray(cb);
};

exports.name = function(name, cb) {
    var re = new RegExp("^" + name.trim());
    mongo.db.collection('topper').find({navn: re}).toArray(cb);
};
