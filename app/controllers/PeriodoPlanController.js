var mongoose = require('mongoose');
var PeriodoPlan = mongoose.model('PeriodoPlan');

//GET - Return all periodoPlanes in the DB
exports.findAll = function(req, res) {
    PeriodoPlan.find(function(err, periodoPlanes) {
        if (err) res.send(500, err.message);
        console.log('GET /periodoPlanes')
        res.status(200).jsonp(periodoPlanes);
    });
};

//GET - Return a periodoPlan with specified ID
exports.findById = function(req, res) {
    PeriodoPlan.findById(req.params.id, function(err, periodoPlan) {
        if (err) return res.send(500, err.message);

        console.log('GET /periodoPlan/' + req.params.id);
        res.status(200).jsonp(periodoPlan);
    });
};

//POST - Insert a new periodoPlan in the DB
exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var periodoPlan = new PeriodoPlan({
        plan: req.body.plan,
        organizacion: req.body.organizacion,
        fch_inicio: req.body.fch_inicio,
        fch_fin: req.body.fch_fin
    });

    periodoPlan.save(function(err, periodoPlan) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(periodoPlan);
    });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
    PeriodoPlan.findById(req.params.id, function(err, periodoPlan) {
        periodoPlan.plan = req.body.plan;
        periodoPlan.organizacion = req.body.organizacion;
        periodoPlan.fch_inicio = req.body.fch_inicio;
        periodoPlan.fch_fin = req.body.fch_fin;
        
        periodoPlan.save(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(periodoPlan);
        });
    });
};

//DELETE - Delete a periodoPlan with specified ID
exports.delete = function(req, res) {
    PeriodoPlan.findById(req.params.id, function(err, periodoPlan) {
        periodoPlan.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(periodoPlan);
        });
    });
};
