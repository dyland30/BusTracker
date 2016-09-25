exports = module.exports = function(app, mongoose) {

	var orgSchema = new mongoose.Schema({
		tipo: 		{ type: String },
    ruta_icono: 	{ type: String },
		idioma: {type:String}
	});
	mongoose.model('TipoUnidad', orgSchema);

};
