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

            //poblar datos
            $scope.poblarDatos();

        }]);

})();
