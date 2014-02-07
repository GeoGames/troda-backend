var ssrjs = require('../lib/ssr');

exports.bbox = function(bbox, cb) {
    ssrjs(bbox.split(','), function(err, data) {
        cb(err, parse(data));
    });
};

exports.name = function(name, cb) {
    ssrjs(name + '*', function(err, data) {
        cb(err, parse(data));
    });
};

function parse(data) {
    // Handle...
    return data;
}
