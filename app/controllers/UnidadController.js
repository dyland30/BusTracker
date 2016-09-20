var mongoose = require('mongoose');
var Unidad  = mongoose.model('Unidad');

//GET - Return all unidades in the DB
exports.findAll = function(req, res) {
	Unidad.find(function(err, unidades) {
    if(err) res.send(500, err.message);
    console.log('GET /unidades')
		res.status(200).jsonp(unidades);
	});
};

//GET - Return a unidad with specified ID
exports.findById = function(req, res) {
	Unidad.findById(req.params.id, function(err, unidad) {
    if(err) return res.send(500, err.message);

    console.log('GET /unidad/' + req.params.id);
		res.status(200).jsonp(unidad);
	});
};

//POST - Insert a new unidad in the DB
exports.add = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var unidad = new Unidad({
		properties:    req.body.properties,
		geometry:			 req.body.geometry
	});

	unidad.save(function(err, unidad) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(unidad);
	});
};

//PUT - Update a register already exists
exports.update = function(req, res) {
	Unidad.findById(req.params.id, function(err, unidad) {
		unidad.properties  =   req.body.properties;
		unidad.geometry  =   req.body.geometry;

		unidad.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(unidad);
		});
	});
};

//DELETE - Delete a unidad with specified ID
exports.delete = function(req, res) {
	Unidad.findById(req.params.id, function(err, unidad) {
		unidad.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(unidad);
		});
	});
};
