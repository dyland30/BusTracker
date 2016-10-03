(function() {
    'use strict';

    angular.module('MantUnidadApp', ['ui.bootstrap', 'ngLoadingSpinner', 'ComunApp'])
        .controller('MainController', ['$scope', '$http', '$filter', '$uibModal', 'comun', function($scope, $http, $filter, $uibModal, comun) {
            //usuario y compañía

            $scope.usuario = {};
            $scope.organizacion = {};
            $scope.listaUnidades = [];

            $scope.poblarDatos = function() {
                //obtener usuario
                comun.obtenerUsuario(function(user) {
                    $scope.usuario = user;
                    //obtener organizacion
                    comun.obtenerOrganizacion(user.idOrganizacion, function(org) {
                        $scope.organizacion = org;
                    });
                    //obtener unidades organizacion
                    comun.obtenerUnidadesOrganizacion(user.idOrganizacion, function(lsUnidades) {
                        $scope.listaUnidades = lsUnidades;

                    });

                });
            };

            $scope.mostrarEditarPopup = function(unidad) {
              alert(unidad.properties.identificador);

            }

            $scope.mostrarCrearPopup = function() {
              //alert("crear");
              var modalCrear = $uibModal.open({
                animation:true,
                templateUrl:'popupCrearUnidad.html',
                controller: 'popupCrearCtrl',
                resolve: {}

              });

              modalCrear.result.then(function(unidad){
                alert(unidad);

              });


            };



            //iniciar
            $scope.poblarDatos();


        }]).controller("popupCrearCtrl",function($scope, $http, $uibModalInstance){
            $scope.unidad = {};

            $scope.guardar = function(){

              $uibModalInstance.close($scope.unidad.properties.identificador);

            }
            $scope.cancelar = function () {
              $uibModalInstance.dismiss();
            }

        });



})();
