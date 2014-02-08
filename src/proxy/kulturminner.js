var request = require('request');

// Lokaliteter
var url = 'http://husmann.ra.no/arcgis/rest/services/Husmann/MapServer/1/query';

exports.bbox = function(bbox, cb) {
    bbox = bbox.split(',');
    var geometry = {
        xmin: bbox[0],
        ymin: bbox[1],
        xmax: bbox[2],
        ymax: bbox[3]
    };
    var query = {
        geometry: JSON.stringify(geometry),
        geometryType: 'esriGeometryEnvelope',
        inSR: '4326',
        outFields: '*',
        returnGeometry: true,
        maxAllowableOffset: '',
        geometryPrecision: '',
        outSR: '4326+',
        returnIdsOnly: false,
        returnCountOnly: false,
        orderByFields: '',
        groupByFieldsForStatistics: '',
        outStatistics: '',
        returnZ: false,
        returnM: false,
        gdbVersion: '',
        returnDistinctValues: false,
        f: 'json',
    };
    var req = request({url: url, qs: query, json: true}, function(err, res, body) {
        return cb(err, parse(body));
    });
};

exports.name = function(name, cb) {
    var where = "LokalitetNavn LIKE '%" + name + "%' OR Beskrivelse LIKE '%" + name + "%' OR Kommune LIKE '%" + name + "%'";
    var query = {
        where: where,
        text: '',
        objectIds: '',
        time: '',
        geometry: '',
        geometryType: 'esriGeometryEnvelope',
        inSR: '',
        spatialRel: 'esriSpatialRelIntersects',
        relationParam: '',
        outFields: '*',
        returnGeometry: true,
        maxAllowableOffset: '',
        geometryPrecision: '',
        outSR: '4326+',
        returnIdsOnly: false,
        returnCountOnly: false,
        orderByFields: '',
        groupByFieldsForStatistics: '',
        outStatistics: '',
        returnZ: false,
        returnM: false,
        gdbVersion: '',
        returnDistinctValues: false,
        f: 'json',
    };
    var req = request({url: url, qs: query, json: true}, function(err, res, body) {
        return cb(err, parse(body));
    });
};

function parse(data) {
    data = data.features;
    data = filter(data);
    data = data.map(function(i) {
        return {
            id: i.attributes.OBJECTID,
            navn: i.attributes.LokalitetNavn,
            type: 'kulturminner',
            geojson: {
                type: 'Point',
                coordinates: ringAvg(i.geometry.rings[0])
            }
        };
    });
    return data;
}

function filter(data) {
    return data.filter(function(i) {
        if(i.attributes["SHAPE.STArea()"] > 20) {
            return false;
        }
        if(i.geometry === undefined || i.geometry.rings === undefined) {
            return false;
        }
        return true;
    });
}

function ringAvg(rings) {
    var x = 0;
    var y = 0;
    rings.forEach(function(i) {
      x += i[0];
      y += i[1];
    });
    x /= rings.length;
    y /= rings.length;
    return [x, y];
}
