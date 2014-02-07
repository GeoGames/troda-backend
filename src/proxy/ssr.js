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
    var navn = data.sokRes.stedsnavn;
    return navn.map(function(i) {
        return {
            id: Number(i.ssrId),
            navn: i.skrivemaatenavn,
            type: 'ssr',
            geometry: {
                type: 'Point',
                coordinates: [i.aust, i.nord]
            }
        };
    });
}
