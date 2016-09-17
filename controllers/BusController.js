var mongoose = require('mongoose');
var Bus  = mongoose.model('Bus');

//GET - Return all buses in the DB
exports.findAll = function(req, res) {
	Bus.find(function(err, buses) {
    if(err) res.send(500, err.message);
    console.log('GET /buses')
		res.status(200).jsonp(buses);
	});
};

//GET - Return a bus with specified ID
exports.findById = function(req, res) {
	Bus.findById(req.params.id, function(err, bus) {
    if(err) return res.send(500, err.message);

    console.log('GET /bus/' + req.params.id);
		res.status(200).jsonp(bus);
	});
};

//POST - Insert a new bus in the DB
exports.add = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var bus = new Bus({
		linea:    req.body.linea,
		empresa: 	req.body.empresa,
		latitud:  req.body.latitud,
		longitud: req.body.longitud,
		tipo:     req.body.tipo,
		estado:   req.body.estado
	});

	bus.save(function(err, bus) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(bus);
	});
};

//PUT - Update a register already exists
exports.update = function(req, res) {
	Bus.findById(req.params.id, function(err, bus) {
		bus.linea       = req.body.linea;
		bus.empresa     = req.body.empresa;
		bus.latitud     = req.body.latitud;
		bus.longitud    = req.body.longitud;
		bus.tipo        = req.body.tipo;
		bus.estado      = req.body.estado;

		bus.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(bus);
		});
	});
};

//DELETE - Delete a bus with specified ID
exports.delete = function(req, res) {
	Bus.findById(req.params.id, function(err, bus) {
		bus.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(bus);
		});
	});
};
