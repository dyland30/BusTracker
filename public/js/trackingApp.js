(function() {
    'use strict';

    angular.module('trackingApp', ['ui.bootstrap']).controller('MainController', function($scope, $http) {
        $scope.organizacion = {};
        $scope.usuario = {};
        $scope.listaUnidades = [];
        $scope.fechaHasta = Date.now();
        $scope.fechaDesde = $scope.fechaHasta- 1;


        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };


        $scope.obtenerUsuario = function() {

            $http({
                method: "GET",
                url: "api/user",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                $scope.usuario = response.data;
                $scope.obtenerOrganizacion($scope.usuario.idOrganizacion);
                //obtener unidades
                $scope.obtenerUnidadesOrganizacion($scope.usuario.idOrganizacion, function() {});
            }, function myError(response) {
                $scope.mensajeError = response.statusText;
            });
        };




        $scope.obtenerOrganizacion = function(idOrganizacion) {
            //
            $http({
                method: "GET",
                url: "api/organizacion/" + idOrganizacion,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                $scope.organizacion = response.data;

            }, function myError(response) {
                $scope.mensajeError = response.statusText;
            });

        };

        //obtener todas las unidades de la organizacion
        $scope.obtenerUnidadesOrganizacion = function(idOrganizacion, callback) {

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

                $scope.listaUnidades = response.data;
                //  alert(response.data);
                callback();


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                callback();
            });
        };

        // obtener usuario
        $scope.obtenerUsuario();


    });



})();
