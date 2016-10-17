exports = module.exports = function(app, mongoose) {

    var planSchema = new mongoose.Schema({
        cantidadUnidadesMax : Number,
        precio: Number,
        descripcion: String,
        estado: String // A Activo E: Eliminado
    });
    mongoose.model('Plan', planSchema);

};
