var mongoose = require('mongoose');
var UnidadHistorial = mongoose.model('UnidadHistorial');


//GET - Return all unidadHistoriales in the DB
exports.findAll = function(req, res) {
    UnidadHistorial.find(function(err, unidadHistoriales) {
        if (err) res.send(500, err.message);
        console.log('GET /unidadHistoriales')
        res.status(200).jsonp(unidadHistoriales);
    });
};

exports.findByUnidadId = function(req, res) {

    //  UnidadHistorial.find({'idUnidad':req.params.idUnidad}).where('idUnidad').equals(req.params.idUnidad).sort({'fecha_registro':-1}).exec(function(err, unidadHistoriales){

    //convert date from ISODATE
    //YYYY-MM-DDTHH:MM:SS

    //var fechaDesde = new Date(req.params.fechaDesde);
    //var fechaHasta = new Date(req.params.fechaHasta);
    var fechaDesde =req.params.fechaDesde;
    var fechaHasta = req.params.fechaHasta;

    var idUnidad = req.params.idUnidad

    console.log(fechaDesde);

    console.log(fechaHasta);

    console.log(idUnidad);


    UnidadHistorial.find({
        $and: [{
            'properties.fecha_registro': {"$gte": fechaDesde, "$lt": fechaHasta}
        }, {
            'properties.idUnidad': idUnidad
        }]
    }).sort({
        'properties.fecha_registro': -1
    }).exec(function(err, unidadHistoriales) {
        if (err) res.send(500, err.message);
        console.log('GET /unidad/historial')

        res.status(200).jsonp(unidadHistoriales);
    });

};
//GET - Return a unidad with specified ID
exports.findById = function(req, res) {
    UnidadHistorial.findById(req.params.id, function(err, unidadHistorial) {
        if (err) return res.send(500, err.message);

        console.log('GET /unidad/' + req.params.id);
        res.status(200).jsonp(unidadHistorial);
    });
};

//POST - Insert a new unidad in the DB
exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var unidadHistorial = new UnidadHistorial({
        properties: req.body.properties,
        geometry: req.body.geometry
    });

    unidadHistorial.save(function(err, unidadHistorial) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(unidadHistorial);
    });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
    UnidadHistorial.findById(req.params.id, function(err, unidadHistorial) {
        unidadHistorial.properties = req.body.properties;
        unidadHistorial.geometry = req.body.geometry;

        unidadHistorial.save(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(unidadHistorial);
        });
    });
};

//DELETE - Delete a unidad with specified ID
exports.delete = function(req, res) {
    UnidadHistorial.findById(req.params.id, function(err, unidadHistorial) {
        unidadHistorial.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(unidadHistorial);
        });
    });
};
