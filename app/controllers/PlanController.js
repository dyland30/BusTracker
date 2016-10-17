var mongoose = require('mongoose');
var Plan = mongoose.model('Plan');

//GET - Return all planes in the DB
exports.findAll = function(req, res) {
    Plan.find(function(err, planes) {
        if (err) res.send(500, err.message);
        console.log('GET /planes')
        res.status(200).jsonp(planes);
    });
};

//GET - Return a plan with specified ID
exports.findById = function(req, res) {
    Plan.findById(req.params.id, function(err, plan) {
        if (err) return res.send(500, err.message);

        console.log('GET /plan/' + req.params.id);
        res.status(200).jsonp(plan);
    });
};

//POST - Insert a new plan in the DB
exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var plan = new Plan({
        cantidadUnidadesMax: req.body.cantidadUnidadesMax,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        estado: req.body.estado
    });

    plan.save(function(err, plan) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(plan);
    });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
    Plan.findById(req.params.id, function(err, plan) {
        plan.cantidadUnidadesMax = req.body.cantidadUnidadesMax;
        plan.precio = req.body.precio;
        plan.descripcion = req.body.descripcion;
        plan.estado = req.body.estado;

        plan.save(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(plan);
        });
    });
};

//DELETE - Delete a plan with specified ID
exports.delete = function(req, res) {
    Plan.findById(req.params.id, function(err, plan) {
        plan.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(plan);
        });
    });
};
