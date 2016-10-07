//notacion de GEO JSON, quiza sea util mas adelante
exports = module.exports = function(app, mongoose) {

    var unidadSchema = new mongoose.Schema({
        properties: {
            identificador: {
                type: String
            },
            idOrganizacion: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Organizacion'
            },
            tipo: {
                type: String
            }, //Camion, BUS, Auto, Moto, Bicicleta, Tren, Tranvia, etc
            estado: {
                type: String
            }, // C -> Conectado, D -> Desconectado, E -> Eliminado
            fch_inicio: {
                type: Date,
                default: Date.now
            },
            fch_fin: {
                type: Date
            },
            placa: {
                type: String
            },
            asignado: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        geometry: {
            type: {
                type: String
            },
            coordinates: [Number]
        }
    });
    mongoose.model('Unidad', unidadSchema);
};
