angular.module('trackingApp', []).controller('MainController', function($scope, $http) {
    $scope.organizacion = "Prueba";
    $scope.usuario = {};

    $scope.obtenerUsuario = function() {
        $http({
            method: 'GET',
            url: '/someUrl'
        }).then(function successCallback(response) {
            $scope.usuario = response.data;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

});
