var mongoose = require('mongoose');
var TipoUnidad = mongoose.model('TipoUnidad');

//GET - Return all tipos in the DB
exports.findAll = function(req, res) {
    TipoUnidad.find(function(err, tipos) {
        if (err) res.send(500, err.message);
        console.log('GET /tipos')
        res.status(200).jsonp(tipos);
    });
};

//GET - Return a tipoUnidad with specified ID
exports.findById = function(req, res) {
    TipoUnidad.findById(req.params.id, function(err, tipoUnidad) {
        if (err) return res.send(500, err.message);

        console.log('GET /tipoUnidad/' + req.params.id);
        res.status(200).jsonp(tipoUnidad);
    });
};

//POST - Insert a new tipoUnidad in the DB
exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var tipoUnidad = new TipoUnidad({
        tipo: req.body.tipo,
        ruta_icono: req.body.ruta_icono,
        idioma: req.body.idioma
    });
    tipoUnidad.save(function(err, tipoUnidad) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(tipoUnidad);
    });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
    TipoUnidad.findById(req.params.id, function(err, tipoUnidad) {
        tipoUnidad.tipo = req.body.tipo;
        tipoUnidad.ruta_icono = req.body.ruta_icono;
        tipoUnidad.idioma = req.body.idioma;
        tipoUnidad.save(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(tipoUnidad);
        });
    });
};

//DELETE - Delete a tipoUnidad with specified ID
exports.delete = function(req, res) {
    TipoUnidad.findById(req.params.id, function(err, tipoUnidad) {
        tipoUnidad.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(tipoUnidad);
        });
    });
};
