(function() {
    'use strict';

    angular.module('ComunApp', []).service('comun', function($http) {
        var comunObj = {};
        var _usuario = {}; // metodos privados
        var _organizacion = {};
        var _mensajeError = "";
        var _listaUnidades = {};

        comunObj.obtenerUsuario = function(callback) {

            $http({
                method: "GET",
                url: "api/user",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _usuario = response.data;
                callback(_usuario);

            }, function myError(response) {
                _mensajeError = response.statusText;
                callback(_usuario);
            });
        };

        comunObj.obtenerOrganizacion = function(idOrganizacion, callback) {
            $http({
                method: "GET",
                url: "api/organizacion/" + idOrganizacion,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _organizacion = response.data;
                callback(_organizacion);

            }, function myError(response) {
                _mensajeError = response.statusText;
                callback(_organizacion);
            });


        };


        //obtener todas las unidades de la organizacion
        comunObj.obtenerUnidadesOrganizacion = function(idOrganizacion, callback) {

            //evitar que se repita la peticion

            var currentdate = new Date();
            var datetime = currentdate.getDate() + "" +
                (currentdate.getMonth() + 1) + "" +
                currentdate.getFullYear() + "" +
                currentdate.getHours() + "" +
                currentdate.getMinutes() + "" +
                currentdate.getSeconds();

            var nocache = Math.floor(Math.random() * 9999);
            $http({
                method: "GET",
                url: "api/organizacion/unidad/" + idOrganizacion + "?nocache=" + datetime + nocache.toString(),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _listaUnidades = response.data;
                //  alert(response.data);
                callback(_listaUnidades);


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                callback(_listaUnidades);
            });
        };





        return comunObj;

    });



})();
