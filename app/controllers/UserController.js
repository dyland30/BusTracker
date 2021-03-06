var mongoose = require('mongoose');
var User = mongoose.model('User');

//GET - Return all users in the DB
exports.findAll = function(req, res) {
    User.find(function(err, users) {
        if (err) res.send(500, err.message);
        console.log('GET /users')
        res.status(200).jsonp(users);
    });
};

exports.getUserSession = function(req,res){
  //devolver usuario en sesion
  res.status(200).jsonp(req.user);
};
//buscar por organizacion
exports.findByOrganizacion = function(req, res) {
    User.where('idOrganizacion', req.params.idOrganizacion).exec(function(err, users) {
        if (err) return res.send(500, err.message);
        console.log('GET /organizacion/users')
        res.status(200).jsonp(users);
    });
};

//GET - Return a user with specified ID
exports.findById = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return res.send(500, err.message);

        console.log('GET /user/' + req.params.id);
        res.status(200).jsonp(user);
    });
};


exports.findByEmail= function(req, res) {
    User.findOne({ 'local.email' :  req.params.email }, function(err, user) {
        if (err) return res.send(500, err.message);

        console.log('GET /user/email/' + req.params.id);
        res.status(200).jsonp(user);
    });
};


exports.login = function(req, res){
  var mensajeError = "Usuario o clave incorrectos";
  User.findOne({ 'local.email' :  req.params.email }, function(err, user) {
      if (err) return res.send(500, err.message);

      if(!user){
        return res.send(500, mensajeError);
      }
      if(!user.validPassword(req.params.clave)){
        return res.send(500,mensajeError);
      }
      console.log('GET /user/login/' + req.params.id);
      res.status(200).jsonp(user);
  });



};



//POST - Insert a new user in the DB

exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var user = new User(req.body);
    //validar complejidad del password
    user.local.password = user.generateHash(req.body.local.password);
    user.fch_modificado = Date.now();
    user.save(function(err, user) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(user);
    });
};


//PUT - Update a register already exists
// no se actualiza el password
exports.update = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user.local.email  =   req.body.local.email;
    user.nombres = req.body.nombres;
    user.docId = req.body.docId;
    user.direccion = req.body.direccion;
    user.rol = req.body.rol;
    user.estado = req.body.estado;
    user.fch_modificado = Date.now();
    user.usuarioModificador = req.body.usuarioModificador;
		user.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(user);
		});
	});
};

//POST
exports.cambiarClave = function(req,res){
  User.findById(req.params.id, function(err, user) {

    var claveAnterior = req.body.claveAnterior;
    var nuevaClave = req.body.nuevaClave;

    if(!user.validPassword(claveAnterior)){
      //la clave anterior no coincide
      return res.send(500,"clave incorrecta!");
    }
		user.local.password  =   user.generateHash(nuevaClave);

		user.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(user);
		});
	});

};

//DELETE - Delete a user with specified ID
exports.delete = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        user.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(user);
        });
    });
};
