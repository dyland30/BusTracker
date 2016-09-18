//notacion de GEO JSON, quiza sea util mas adelante
exports = module.exports = function(app, mongoose) {

	var unidadSchema = new mongoose.Schema({
    properties: {
			nombre: 	{ type: String },
      empresa: 	{ type: String },
      tipo: 		{	type: String },
      estado:   { type: String }, // C -> Conectado, D -> Desconectado, E -> Eliminado
			fch_inicio: { type: Date },
			fch_fin: { type: Date},
			placa: {type: String}
    },
    geometry:{
      type: { type: String },
      coordinates: [Number]
    }
		});
	mongoose.model('Unidad', unidadSchema);
};
