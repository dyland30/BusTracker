exports = module.exports = function(app, mongoose) {

	var orgSchema = new mongoose.Schema({
		razon_social: 		{ type: String },
    nombre_comercial: 	{ type: String },
		docId: {type:String},
    direccion: 	[String],
    zip_code: 	{ type: String },
    fecha_registro: {type: Date,default: Date.now },
		estado: { type: String}, // A -> Activo, E -> Eliminado
		contacto: [{nombre: String, direccion: String, email: String}]
	});
	mongoose.model('Organizacion', orgSchema);

};
