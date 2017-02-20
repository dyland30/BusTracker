var mongoose = require('mongoose');
var Unidad = mongoose.model('Unidad');

//GET - Return all unidades in the DB
exports.findAll = function(req, res) {
    Unidad.find(function(err, unidades) {
        if (err)
            res.send(500, err.message);
        console.log('GET /unidades')
        res.status(200).jsonp(unidades);
    });
};


//
//buscar por organizacion y solo unidades activas, ademas considerar conectadas y desconectadas
exports.findByIdOrg = function(req, res) {

    Unidad.find({
        $and: [
            {
                'properties.idOrganizacion' : req.params.idOrganizacion
            },   {
                  'properties.estado': {
                      $ne: 'E'
                  }
            }
        ]
    }).populate('properties.asignado').exec(function(err, unidades) {
        if (err)
            return res.send(500, err.message);
        console.log('GET /organizacion/unidades')
        res.status(200).jsonp(unidades);
    });
};


//buscar por organizacion y solo unidades activas, ademas considerar conectadas y desconectadas
exports.findByOrganizacion = function(req, res) {
  var estado = "C";
  if(req.params.mostrarUnidadesDesconectadas=="true"){
    estado = "D";
    console.log("Mostrar Desconectadas");
  }

var arrayBusqueda = [
    {
        'properties.idOrganizacion' : req.params.idOrganizacion
    }, {
        'properties.estado': estado
    }
];

if(req.params.tipo!=undefined && req.params.tipo!=null && req.params.tipo!="" && req.params.tipo!="all"){
  var buscarPorTipo = {
      'properties.tipo': req.params.tipo
  };

  arrayBusqueda.push(buscarPorTipo);
}

if(req.params.asignado!=undefined && req.params.asignado!=null && req.params.asignado!="" && req.params.asignado!="all"){
  var buscarPorAsignado = {
      'properties.asignado': req.params.asignado
  };

  arrayBusqueda.push(buscarPorAsignado);
}

    Unidad.find({
        $and: arrayBusqueda
    }).populate('properties.asignado').exec(function(err, unidades) {
        if (err)
            return res.send(500, err.message);
        console.log('GET /organizacion/unidades')
        res.status(200).jsonp(unidades);
    });
};

//GET - Return a unidad with specified ID
exports.findById = function(req, res) {
    Unidad.findById(req.params.id, function(err, unidad) {
        if (err)
            return res.send(500, err.message);

        console.log('GET /unidad/' + req.params.id);
        res.status(200).jsonp(unidad);
    }).populate('properties.asignado');
};

//POST - Insert a new unidad in the DB
exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var unidad = new Unidad({properties: req.body.properties, geometry: req.body.geometry});

    unidad.save(function(err, unidad) {
        if (err)
            return res.send(500, err.message);
        res.status(200).jsonp(unidad);
    });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
    Unidad.findById(req.params.id, function(err, unidad) {
        unidad.properties = req.body.properties;
        unidad.geometry = req.body.geometry;

        unidad.save(function(err) {
            if (err)
                return res.send(500, err.message);
            res.status(200).jsonp(unidad);
        });
    });
};

//ACTUALIZAR SOLO LATITUD Y longitud tambien establecer estado conectado
exports.updateLocation = function(req, res) {
    Unidad.findById(req.params.id, function(err, unidad) {
        unidad.geometry.coordinates = req.body.coordinates;
        unidad.properties.estado ="C";
        unidad.save(function(err) {
            if (err)
                return res.send(500, err.message);
            res.status(200).jsonp(unidad);
        });
    });
};

exports.updateStatus = function(req, res) {
    Unidad.findById(req.params.id, function(err, unidad) {
        unidad.properties.estado =req.body.estado;
        unidad.save(function(err) {
            if (err)
                return res.send(500, err.message);
            res.status(200).jsonp(unidad);
        });
    });
};


//DELETE - Delete a unidad with specified ID
exports.delete = function(req, res) {
    Unidad.findById(req.params.id, function(err, unidad) {
        unidad.remove(function(err) {
            if (err)
                return res.send(500, err.message);
            res.status(200).jsonp(unidad);
        });
    });
};
