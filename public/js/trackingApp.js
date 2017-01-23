(function() {
    'use strict';

    angular.module('trackingApp', ['ui.bootstrap']).controller('MainController', function($scope, $http) {
        $scope.organizacion = {};
        $scope.usuario = {};
        $scope.unidadSeleccionada = {};

        $scope.listaUnidades = [];
        $scope.fechaHasta = new Date();
        $scope.fechaDesde = new Date();

        $scope.horaInicio = new Date();
        $scope.horaFin = new Date();

        $scope.horaInicio.setHours(0);
        $scope.horaInicio.setMinutes(0);

        $scope.horaFin.setHours(23);
        $scope.horaFin.setMinutes(59);

        var tituloMostrarHist = "Mostrar Historial";
        var tituloOcultarHist = "Ocultar Historial";

        $scope.btnHistorialTitle = tituloMostrarHist;
        $scope.btnHistorialTitle = tituloMostrarHist;

        $scope.flgMostrarHistorial = false;


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

        var getNoCache = function() {
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "" +
                (currentdate.getMonth() + 1) + "" +
                currentdate.getFullYear() + "" +
                currentdate.getHours() + "" +
                currentdate.getMinutes() + "" +
                currentdate.getSeconds();


            var nocache = Math.floor(Math.random() * 9999);

            var str = +datetime + nocache.toString();

            return str;

        };
        //obtener todas las unidades de la organizacion
        $scope.obtenerUnidadesOrganizacion = function(idOrganizacion, callback) {

            //evitar que se repita la peticion

            $http({
                method: "GET",
                url: "api/organizacion/unidad/" + idOrganizacion + "?nocache=" + getNoCache(),
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

        //obtener historial por unidad

        $scope.obtenerHistorial = function(callback) {
          var idUnidad = $scope.unidadSeleccionada._id;

          var fechaDesde = new Date();
          var fechaHasta = new Date();

          if($scope.fechaDesde != undefined && $scope.fechaDesde !=null)
            fechaDesde = $scope.fechaDesde.toISOString();
          if($scope.fechaHasta != undefined && $scope.fechaHasta !=null)
            fechaHasta = $scope.fechaHasta.toISOString();

            $http({
                method: "GET",
                url: "api/unidad/historial/" + idUnidad + "/" + fechaDesde + "/" + fechaHasta + "?nocache=" + getNoCache(),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                $scope.listaHistorial = response.data;
                //  alert(response.data);
                callback();


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                callback();
            });




        };

        $scope.cmbUnidadChange = function(){
          //  alert($scope.unidadSeleccionada._id);



        };

        $scope.btnBuscarClick = function() {

            $scope.flgMostrarHistorial = !$scope.flgMostrarHistorial;
            if ($scope.flgMostrarHistorial) {
                $scope.btnHistorialTitle = tituloOcultarHist;
            } else {
                $scope.btnHistorialTitle = tituloMostrarHist;
            }

        };




        // obtener usuario
        $scope.obtenerUsuario();


    });




})();
