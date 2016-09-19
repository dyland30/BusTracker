var mongoose = require('mongoose');
var Organizacion  = mongoose.model('Organizacion');

//GET - Return all organizaciones in the DB
exports.findAll = function(req, res) {
	Organizacion.find(function(err, organizaciones) {
    if(err) res.send(500, err.message);
    console.log('GET /organizaciones')
		res.status(200).jsonp(organizaciones);
	});
};

//GET - Return a organizacion with specified ID
exports.findById = function(req, res) {
	Organizacion.findById(req.params.id, function(err, organizacion) {
    if(err) return res.send(500, err.message);

    console.log('GET /organizacion/' + req.params.id);
		res.status(200).jsonp(organizacion);
	});
};

//POST - Insert a new organizacion in the DB
exports.add = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var organizacion = new Organizacion({
		razon_social:    req.body.razon_social,
		nombre_comercial: 	req.body.nombre_comercial,
    docId : req.body.docId,
		direccion:  req.body.direccion,
		zip_code: req.body.zip_code,
		fecha_registro:     req.body.fecha_registro,
		estado:   req.body.estado,
		contacto: req.body.contacto
	});

	organizacion.save(function(err, organizacion) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(organizacion);
	});
};

//PUT - Update a register already exists
exports.update = function(req, res) {
	Organizacion.findById(req.params.id, function(err, organizacion) {
		organizacion.razon_social     =   req.body.razon_social;
		organizacion.nombre_comercial = 	req.body.nombre_comercial;
    organizacion.docId            =   req.body.docId;
		organizacion.direccion				=  	req.body.direccion;
    organizacion.zip_code         =   req.body.zip_code;
    organizacion.fecha_registro		= 	req.body.fecha_registro;
		organizacion.estado				    = 	req.body.estado;
		organizacion.contacto					=   req.body.contacto;

		organizacion.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(organizacion);
		});
	});
};

//DELETE - Delete a organizacion with specified ID
exports.delete = function(req, res) {
	Organizacion.findById(req.params.id, function(err, organizacion) {
		organizacion.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(organizacion);
		});
	});
};
