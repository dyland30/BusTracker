exports = module.exports = function(app, mongoose) {

    var busSchema = new mongoose.Schema({
        linea: {
            type: String
        },
        empresa: {
            type: String
        },
        latitud: {
            type: Number
        },
        longitud: {
            type: Number
        },
        tipo: {
            type: String,
            enum: ['Bus', 'Tren', 'Metro', 'Tram', 'Vapporeto']
        },
        estado: {
            type: String,
            enum: ['Conectado', 'Desconectado']
        }

    });

    mongoose.model('Bus', busSchema);

};

/*
{"linea":"A206","empresa":"Corredor Azul","latitud":-75.67,"longitud":-15.88,"tipo":"Bus","estado:"Conectado"}

{
"linea":"A206",
"empresa":"Corredor Azul",
"latitud": -75.67,
"longitud": -15.88,
"tipo":"Bus",
"estado:"Conectado"
}
*/
