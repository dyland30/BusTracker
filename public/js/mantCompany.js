(function() {
    'use strict';

    angular.module('MantOrganizacionApp', ['ui.bootstrap', 'ngLoadingSpinner', 'ComunApp']).controller('MainController', [
        '$scope',
        '$http',
        '$filter',
        '$uibModal',
        'comun',
        function($scope, $http, $filter, $uibModal, comun) {
            //organizacion y compañía

            $scope.organizacion = {};
            $scope.organizacion = {};
            $scope.listaOrganizaciones = [];

            $scope.poblarDatos = function() {
                //obtener organizacion
                comun.obtenerOrganizacion(function(user) {
                    $scope.usuario = user;
                    //obtener organizacion
                    comun.obtenerOrganizacion(user.idOrganizacion, function(org) {
                        $scope.organizacion = org;
                    });
                    //obtener organizaciones organizacion
                    comun.obtenerOrganizacionesOrganizacion(user.idOrganizacion, function(lsOrganizaciones) {
                        $scope.listaOrganizaciones = lsOrganizaciones;

                    });


                });
            };


            $scope.mostrarCrearPopup = function() {
                //alert("crear");
                var modalCrear = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupCrearOrganizacion.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.organizacion.idOrganizacion;
                        },
                        operacion: function() {
                            return "agregar";
                        },
                        organizacion: function() {
                            return {}; //objeto en blanco
                        }
                    }

                });

                modalCrear.result.then(function(organizacion) {
                    //alert(organizacion._id);
                    $scope.poblarDatos();

                });

            };

            $scope.mostrarEditarPopup = function(organizacion) {
                var modalCrear = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupCrearOrganizacion.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.organizacion.idOrganizacion;
                        },
                        operacion: function() {
                            return "editar";
                        },
                        organizacion: function() {
                            return organizacion; //objeto en blanco
                        }
                    }

                });
                modalCrear.result.then(function(und) {
                    //alert(organizacion._id);
                    $scope.poblarDatos();

                });

            };

            $scope.mostrarEliminarPopup = function(organizacion) {
                var modalEliminar = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupEliminar.html',
                    controller: 'popupEliminarCtrl',
                    resolve: {
                        organizacion: function() {
                            return organizacion; //objeto en blanco
                        }
                    }

                });
                modalEliminar.result.then(function(und) {
                    //alert(organizacion._id);
                    $scope.poblarDatos();

                });

            };

            //iniciar
            $scope.poblarDatos();

        }
    ]).controller("popupCrearCtrl", function($scope, $http, $uibModalInstance, idOrg, operacion, organizacion, comun) {
        $scope.organizacion = organizacion;
        $scope.titulo = "Editar Organizacion";
        $scope.fecha = new Date();
        $scope.flgEditar = false;
        $scope.flgCambiarClave = false;
        $scope.rolSeleccionado = "user";
        $scope.clave = "";
        $scope.repetirClave = "";
        $scope.direccion_0 ="";
        $scope.direccion_1 ="";
        //alert($scope.organizacionSeleccionado);

        if (operacion == "agregar") {
            $scope.organizacion.idOrganizacion = idOrg;
            $scope.flgCambiarClave = true;

            $scope.titulo = "Crear Organizacion"
        } else if (operacion == "editar") {
            if ($scope.organizacion.rol != null && $scope.organizacion.rol != undefined)
                $scope.rolSeleccionado = $scope.organizacion.rol;

            $scope.organizacion.fch_modificado = Date.now();
            $scope.flgEditar = true;
            $scope.rolSeleccionado = $scope.organizacion.rol;
            $scope.direccion_0 =$scope.organizacion.direccion[0];
            $scope.direccion_1 =$scope.organizacion.direccion[1];
            //  alert($scope.organizacionSeleccionado);
        }
        $scope.cmbRolChange = function() {
            //alert($scope.organizacionSeleccionado._id);
        };

        $scope.validarClave = function(callback) {
            if ($scope.clave.length >= 8) {
                //validar que la clave coincida
                if ($scope.clave == $scope.repetirClave) {
                    callback();
                } else {

                    alert("Las contraseñas ingresadas no coinciden");
                }

            } else {
                //utilizar mensajes mas estilizados
                alert("La clave debe tener una longitud mayor a 8 caracteres.");
            }

        };


        $scope.guardar = function() {
            $scope.organizacion.rol = $scope.rolSeleccionado;
            $scope.organizacion.direccion = [$scope.direccion_0, $scope.direccion_1];
            //completar objeto
            if (operacion == "agregar") {
                //validar correo y validar que sea unico
                $scope.organizacion.local.password = $scope.clave;


                //validar clave
                $scope.validarClave(function(){
                  //valido
                  comun.guardarOrganizacion($scope.organizacion, function(_und) {
                      //alert(_und.id);
                      //agregar roles
                      $uibModalInstance.close(_und);
                  });

                });
            } else if (operacion == "editar") {
                //Editar
                if($scope.flgCambiarClave){
                  $scope.validarClave(function(){
                    //valido
                    comun.editarOrganizacion($scope.organizacion, function(_und) {
                        $uibModalInstance.close(_und);
                    });
                  });
                } else{
                    // no validar clave
                    comun.editarOrganizacion($scope.organizacion, function(_und) {
                        $uibModalInstance.close(_und);
                    });

                }

            }
        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    }).controller("popupEliminarCtrl", function($scope, $http, $uibModalInstance, organizacion, comun) {
        $scope.organizacion = organizacion;

        $scope.eliminar = function() {
            $scope.organizacion.properties.estado = "E"; // e de eliminado
            comun.editarOrganizacion($scope.organizacion, function(_und) {
                $uibModalInstance.close(_und);
            });
        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    });

})();
