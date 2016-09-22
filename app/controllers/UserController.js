var mongoose = require('mongoose');
var User  = mongoose.model('User');

//GET - Return all users in the DB
exports.findAll = function(req, res) {
	User.find(function(err, users) {
    if(err) res.send(500, err.message);
    console.log('GET /users')
		res.status(200).jsonp(users);
	});
};

//buscar por organizacion
exports.findByOrganizacion = function(req,res){
	User.where('idOrganizacion',req.params.idOrganizacion).exec(function(err,users){
		if(err) return res.send(500, err.message);
		console.log('GET /organizacion/users')
		res.status(200).jsonp(users);
	});
};

//GET - Return a user with specified ID
exports.findById = function(req, res) {
	User.findById(req.params.id, function(err, user) {
    if(err) return res.send(500, err.message);

    console.log('GET /user/' + req.params.id);
		res.status(200).jsonp(user);
	});
};

//POST - Insert a new user in the DB

exports.add = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var user = new User(req.body.properties);

	user.save(function(err, user) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(user);
	});
};

//PUT - Update a register already exists
/*
exports.update = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user  =   req.body;

		user.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(user);
		});
	});
};
*/

//DELETE - Delete a user with specified ID
exports.delete = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(user);
		});
	});
};
