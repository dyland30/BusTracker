//notacion de GEO JSON, quiza sea util mas adelante
exports = module.exports = function(app, mongoose) {

    var unidadHistorialSchema = new mongoose.Schema({
        properties: {
            idUnidad: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Unidad'
            },
            asignado: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fecha_registro: {
                type: Date,
                default: Date.now
            },
            velocidad_instantanea:{
              type: String,
              default: '0'
            }
        },
        geometry: {
            type: {
                type: String
            },
            coordinates: [Number]
        }
    });
    mongoose.model('UnidadHistorial', unidadHistorialSchema);
};
