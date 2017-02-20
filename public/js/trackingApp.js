(function() {
    'use strict';

    angular.module('trackingApp', ['ui.bootstrap','ComunApp']).controller('MainController', function($scope, $http,comun) {
        $scope.organizacion = {};
        $scope.usuario = {};
        $scope.unidadSeleccionada = {};
        $scope.asignadoSeleccionado = null;
        $scope.tipoSeleccionado = null;
        $scope.unidadFiltroSeleccionada = {};

        $scope.listaUnidades = [];
        $scope.fechaHasta = new Date();
        $scope.fechaDesde = new Date();

        $scope.horaInicio = new Date();
        $scope.horaFin = new Date();

        $scope.horaInicio.setHours(0);
        $scope.horaInicio.setMinutes(0);

        $scope.horaFin.setHours(23);
        $scope.horaFin.setMinutes(59);

        $scope.mostrarUnidadesDesconectadas =false;
        $scope.listaTipos = ["Auto","Bicicleta", "Bus", "Camion","Motocicleta"];
        $scope.listaUsuarios = [];
        $scope.unidadesFiltro = [];



        $scope.mostrarOpcionesBusqueda = true;


        var tituloMostrarOpc = "Mostrar filtros";
        var tituloOcultarOpc = "Ocultar filtros";

        $scope.btnBusquedaTitle = tituloOcultarOpc;


        var tituloMostrarHist = "Mostrar Historial";
        var tituloOcultarHist = "Ocultar Historial";

        $scope.btnHistorialTitle = tituloMostrarHist;
        $scope.btnHistorialTitle = tituloMostrarHist;

        $scope.flgMostrarHistorial = false;

        $scope.btnOpcionesBusquedaClick = function(){
          $scope.mostrarOpcionesBusqueda = !$scope.mostrarOpcionesBusqueda;
          if($scope.mostrarOpcionesBusqueda){
              $scope.btnBusquedaTitle = tituloOcultarOpc;
          } else{
              $scope.btnBusquedaTitle = tituloMostrarOpc;
          }

        };

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
                //obtener unidades para filtro
                comun.obtenerUnidadesOrganizacion($scope.usuario.idOrganizacion, function(lsUnidades) {

                  $scope.unidadesFiltro = lsUnidades;
                });

                //obtnener usuarios
                comun.obtenerUsuariosOrganizacion($scope.usuario.idOrganizacion, function(lsUsuarios) {
                    $scope.listaUsuarios = lsUsuarios;

                });


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
        $scope.obtenerUnidadesFiltro = function(idOrganizacion,mostrarUnidadesDesconectadas, tipoSeleccionado,asignadoSeleccionado,callback) {
            var asignadoId = "all";
            //evitar que se repita la peticion
            if(tipoSeleccionado==undefined || tipoSeleccionado==null || tipoSeleccionado=="")
              tipoSeleccionado="all";

            if(asignadoSeleccionado!=undefined && asignadoSeleccionado!=null)
                asignadoId=asignadoSeleccionado._id;



            $http({
                method: "GET",
                url: "api/organizacion/unidad/" + idOrganizacion +"/"+mostrarUnidadesDesconectadas+"/"+tipoSeleccionado+"/"+asignadoId + "?nocache=" + getNoCache(),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                $scope.listaUnidades = response.data;
                //  alert(response.data);
                if(callback != undefined) callback();


            }, function myError(response) {
                $scope.mensajeError = response.statusText;
                if(callback != undefined) callback();
            });
        };

        //obtener historial por unidad

        $scope.obtenerHistorial = function(callback) {
          var idUnidad = $scope.unidadSeleccionada._id;

          var fechaDesde = new Date();
          var fechaHasta = new Date();



          if($scope.fechaDesde != undefined && $scope.fechaDesde !=null)
            fechaDesde = $scope.fechaDesde;
          if($scope.fechaHasta != undefined && $scope.fechaHasta !=null)
            fechaHasta = $scope.fechaHasta;

          if($scope.horaInicio != undefined && $scope.horaInicio !=null){
            fechaDesde.setHours($scope.horaInicio.getHours());
            fechaDesde.setMinutes($scope.horaInicio.getMinutes());
          }

          if($scope.horaFin != undefined && $scope.horaFin !=null){
            fechaHasta.setHours($scope.horaFin.getHours());
            fechaHasta.setMinutes($scope.horaFin.getMinutes());
          }
          console.log("fecha desde: "+fechaDesde.toISOString());
          console.log("fecha hasta: "+fechaHasta.toISOString());

            $http({
                method: "GET",
                url: "api/unidad/historial/" + idUnidad + "/" + fechaDesde.toISOString() + "/" + fechaHasta.toISOString() + "?nocache=" + getNoCache(),
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
          //$scope.btnMostrarHistorialClick();

        };

        $scope.cmbTipoChange = function(){
          //  alert($scope.unidadSeleccionada._id);
          //$scope.btnMostrarHistorialClick();

        };

        $scope.cmbUsuarioChange = function(){
          //  alert($scope.unidadSeleccionada._id);
          //$scope.btnMostrarHistorialClick();

        };


        $scope.btnMostrarHistorialClick = function() {

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
