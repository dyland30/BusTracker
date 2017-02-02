var cron = require('cron'),
    mongoose = require('mongoose');
var async = require('async');

require('dotenv').config();
var app = undefined;

var unidadModel = require('../models/Unidad.js')(app, mongoose);
var unidadHistorialModel = require('../models/UnidadHistorial.js')(app, mongoose);

var db = undefined;

var cronJob = cron.job("*/10 * * * * *", function() {


    // cerrar conexion
    try {

        //conectar a la base de datos si es que no hay una conexion activa
        /*if(db!=undefined){
          // si hay conexion se desconecta
          mongoose.connection.close();
          db = undefined;
          console.info("conexion cerrada");
          mongoose.connect(process.env.DB_URI);
          db = mongoose.connection;

        } else{*/

        mongoose.connect(process.env.DB_URI);
        db = mongoose.connection;

        //}

        console.info(process.env.DB_URI);

        db.on('error', function() {
            console.info("Error al conectarse");
        });

        db.once('open', function() {
            var Schema = mongoose.Schema;
            var Unidad = mongoose.model('Unidad', Schema);
            var UnidadHistorial = mongoose.model('UnidadHistorial', Schema);
            //buscar unidades
            console.info('conectados a la BD!');

            Unidad.find({}, function(err, unidades) {

                if (err) console.info("Error");

                console.info('la bd devolvio data unidades');

              
                unidades.forEach(function(u) {
                    if (u.properties != undefined) {
                        console.info(u.properties.identificador);
                        //obtener último historial
                      //  console.info(u.id);

                        UnidadHistorial.findOne({
                            'properties.idUnidad': u.id
                        }).sort({
                            'properties.fecha_registro': -1
                        }).limit(2).exec(function(err, unidadHistorial) {
                            if (err) console.info("Error");
                            console.info(unidadHistorial);
                            if(unidadHistorial!=undefined){
                              console.info(unidadHistorial.properties.idUnidad);



                            }

                        });
                    }




                });

                console.info("desconectado");
                mongoose.connection.close();
                db = undefined;
                //console.info(unidades);

            });

        });

    } catch (e) {

        console.info(e);
    } finally {
        //mongoose.connection.close();

    }






});
cronJob.start();
