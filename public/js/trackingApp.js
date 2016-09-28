angular.module('trackingApp', []).controller('MainController', function($scope, $http) {
    $scope.organizacion = {};
    $scope.usuario = {};
    $scope.unidades = [];

    $scope.obtenerUsuario = function() {

      $http({
          method: "GET",
          url: "api/user",
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }).then(function mySucces(response) {

          $scope.usuario = response.data;
          $scope.obtenerCompania($scope.usuario.idOrganizacion);

      }, function myError(response) {
          $scope.mensajeError = response.statusText;
      });
    };

  $scope.obtenerCompania = function(idOrganizacion){
    //
    $http({
        method: "GET",
        url: "api/organizacion/"+idOrganizacion,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then(function mySucces(response) {

        $scope.organizacion = response.data;
      //  alert(response.data);

    }, function myError(response) {
        $scope.mensajeError = response.statusText;
    });

  };


// obtener usuario
$scope.obtenerUsuario();


});
