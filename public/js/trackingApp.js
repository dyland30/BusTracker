angular.module('trackingApp', []).controller('MainController', function($scope, $http) {
    $scope.organizacion = {};
    $scope.usuario = {};
    $scope.listaUnidades = [];

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
            $scope.obtenerUnidadesOrganizacion($scope.usuario.idOrganizacion);
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
    $scope.obtenerUnidadesOrganizacion = function(idOrganizacion){

      $http({
          method: "GET",
          url: "api/organizacion/unidad/" + idOrganizacion,
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }).then(function mySucces(response) {

          $scope.listaUnidades = response.data;
          //  alert(response.data);

      }, function myError(response) {
          $scope.mensajeError = response.statusText;
      });
    };

    // obtener usuario
    $scope.obtenerUsuario();


});
