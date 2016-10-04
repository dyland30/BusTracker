(function() {
    'use strict';

    angular.module('MantUnidadApp', ['ui.bootstrap', 'ngLoadingSpinner', 'ComunApp']).controller('MainController', [
        '$scope',
        '$http',
        '$filter',
        '$uibModal',
        'comun',
        function($scope, $http, $filter, $uibModal, comun) {
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
                    animation: true,
                    templateUrl: 'popupCrearUnidad.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.usuario.idOrganizacion;
                        }
                    }

                });

                modalCrear.result.then(function(unidad) {
                    alert(unidad._id);

                });

            };

            //iniciar
            $scope.poblarDatos();

        }
    ]).controller("popupCrearCtrl", function($scope, $http, $uibModalInstance, idOrg, comun) {
        $scope.unidad = {};
        $scope.fecha = new Date();

        $scope.guardar = function() {
            //completar objeto
            $scope.unidad.properties.estado = "D";
            $scope.unidad.properties.idOrganizacion = idOrg;
            $scope.unidad.geometry={}
            $scope.unidad.geometry.type='Point'
            $scope.unidad.geometry.coordinates = [0, 0];

            comun.guardarUnidad($scope.unidad, function(_und) {
                //alert(_und.id);
                $uibModalInstance.close(_und);
            });

        }
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    });

})();
