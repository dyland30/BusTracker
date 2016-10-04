(function() {
    'use strict';

    angular.module('ComunApp', []).service('comun', function($http) {
        var comunObj = {};
        var _usuario = {}; // metodos privados
        var _organizacion = {};
        var _mensajeError = "";
        var _listaUnidades = {};
        var _unidad = {};

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

        //guardar unidad

        comunObj.guardarUnidad = function(unidad, callback) {

            $http({
                method: "POST",
                url: "api/unidad/",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: angular.toJson(unidad)
            }).then(function mySucces(response) {

                _unidad = response.data;
                //  alert(response.data);
                callback(_unidad);


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                callback(_unidad);
            });

        };

        //obtener Unidad por Id
        comunObj.obtenerUnidadId = function(id, callback) {
            $http({
                method: "GET",
                url: "api/unidad/" + id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _unidad = response.data;
                //  alert(response.data);
                callback(_unidad);


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                callback(_unidad);
            });

        };

        //editar unidad
        comunObj.editarUnidad = function(unidad, callback) {

            //obtener unidad por id
            comunObj.obtenerUnidadId(unidad._id, function(und) {
                //solo actualizar sus propiedades no la geometria
                und.properties = unidad.properties;

                $http({
                    method: "PUT",
                    url: "api/unidad/" + unidad._id,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: angular.toJson(und)
                }).then(function mySucces(response) {

                    _unidad = response.data;
                    //  alert(response.data);
                    callback(_unidad);

                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                    callback(_unidad);
                });

            });

        };


        return comunObj;

    });



})();
