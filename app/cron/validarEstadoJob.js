var cron = require('cron'),
    mongoose = require('mongoose');

  require('dotenv').config();
var app = undefined;

var organizacionModel = require('../models/Organizacion.js')(app, mongoose);

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

      db.on('error',function(){
        console.info("Error al conectarse");
      });

      db.once('open',function(){
        var Schema = mongoose.Schema;
        var Organizacion = mongoose.model('Organizacion', Schema);

        //buscar organizaciones
        console.info('conectados a la BD!');

        Organizacion.find({},function(err, organizaciones) {

            if (err) console.info("Error");

            console.info('la bd devolvio data organizaciones');
            organizaciones.forEach(function(o){
                console.info(o.razon_social);
            });

            mongoose.connection.close();
            db = undefined;
            //console.info(organizaciones);

        });

      });

    } catch (e) {

        console.info(e);
    } finally {
      //mongoose.connection.close();

    }






});
cronJob.start();
