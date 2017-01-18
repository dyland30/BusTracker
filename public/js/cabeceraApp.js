(function() {
    'use strict';

    angular.module('CabeceraApp', ['ComunApp']).controller('CabeceraController', ['$scope', 'comun',
        function($scope, comun) {
            $scope.organizacion = {};

            $scope.poblarCabecera = function() {

                comun.obtenerUsuario(function(user) {

                    comun.obtenerOrganizacion(user.idOrganizacion, function(org) {
                        $scope.empresa = org;
                    });

                });
            };

            //iniciar controlador
            $scope.poblarCabecera();



        }
    ]);


})();
