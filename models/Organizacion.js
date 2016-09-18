exports = module.exports = function(app, mongoose) {

	var orgSchema = new mongoose.Schema({
		razon_social: 		{ type: String },
    nombre_comercial: 	{ type: String },
    direccion_linea1: 	{ type: String },
    direccion_linea2: 	{ type: String },
    zip_code: 	{ type: String },
    fecha_registro: {type: Date},
		estado: { type: String},
		contacto: [{nombre: String, direccion: String, email: String}]    
	});
	mongoose.model('Organizacion', orgSchema);

};
