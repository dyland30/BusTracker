(function() {
    'use strict';

    angular.module('MantUsuarioApp', ['ui.bootstrap', 'ngLoadingSpinner', 'ComunApp']).controller('MainController', [
        '$scope',
        '$http',
        '$filter',
        '$uibModal',
        'comun',
        function($scope, $http, $filter, $uibModal, comun) {
            //usuario y compañía

            $scope.usuario = {};
            $scope.organizacion = {};
            $scope.listaUsuarios = [];

            $scope.poblarDatos = function() {
                //obtener usuario
                comun.obtenerUsuario(function(user) {
                    $scope.usuario = user;
                    //obtener organizacion
                    comun.obtenerOrganizacion(user.idOrganizacion, function(org) {
                        $scope.organizacion = org;
                    });
                    //obtener usuarios organizacion
                    comun.obtenerUsuariosOrganizacion(user.idOrganizacion, function(lsUsuarios) {
                        $scope.listaUsuarios = lsUsuarios;

                    });


                });
            };


            $scope.mostrarCrearPopup = function() {
                //alert("crear");
                var modalCrear = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupCrearUsuario.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.usuario.idOrganizacion;
                        },
                        operacion: function() {
                            return "agregar";
                        },
                        usuario: function() {
                            return {}; //objeto en blanco
                        }
                    }

                });

                modalCrear.result.then(function(usuario) {
                    //alert(usuario._id);
                    $scope.poblarDatos();

                });

            };

            $scope.mostrarEditarPopup = function(usuario) {
                var modalCrear = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupCrearUsuario.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.usuario.idOrganizacion;
                        },
                        operacion: function() {
                            return "editar";
                        },
                        usuario: function() {
                            return usuario; //objeto en blanco
                        }
                    }

                });
                modalCrear.result.then(function(und) {
                    //alert(usuario._id);
                    $scope.poblarDatos();

                });

            };

            $scope.mostrarEliminarPopup = function(usuario) {
                var modalEliminar = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupEliminar.html',
                    controller: 'popupEliminarCtrl',
                    resolve: {
                        usuario: function() {
                            return usuario; //objeto en blanco
                        }
                    }

                });
                modalEliminar.result.then(function(und) {
                    //alert(usuario._id);
                    $scope.poblarDatos();

                });

            };

            //iniciar
            $scope.poblarDatos();

        }
    ]).controller("popupCrearCtrl", function($scope, $http, $uibModalInstance, idOrg, operacion, usuario, comun) {
        $scope.usuario = usuario;
        $scope.titulo = "Editar Usuario";
        $scope.fecha = new Date();
        $scope.flgEditar = false;
        $scope.flgCambiarClave = false;
        $scope.rolSeleccionado = "user";
        $scope.clave = "";
        $scope.repetirClave = "";
        $scope.direccion_0 ="";
        $scope.direccion_1 ="";
        //alert($scope.usuarioSeleccionado);

        if (operacion == "agregar") {
            $scope.usuario.idOrganizacion = idOrg;
            $scope.flgCambiarClave = true;

            $scope.titulo = "Crear Usuario"
        } else if (operacion == "editar") {
            if ($scope.usuario.rol != null && $scope.usuario.rol != undefined)
                $scope.rolSeleccionado = $scope.usuario.rol;

            $scope.usuario.fch_modificado = Date.now();
            $scope.flgEditar = true;
            $scope.rolSeleccionado = $scope.usuario.rol;
            $scope.direccion_0 =$scope.usuario.direccion[0];
            $scope.direccion_1 =$scope.usuario.direccion[1];
            //  alert($scope.usuarioSeleccionado);
        }
        $scope.cmbRolChange = function() {
            //alert($scope.usuarioSeleccionado._id);
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
            $scope.usuario.rol = $scope.rolSeleccionado;
            $scope.usuario.direccion = [$scope.direccion_0, $scope.direccion_1];
            //completar objeto
            if (operacion == "agregar") {
                //validar correo y validar que sea unico
                $scope.usuario.local.password = $scope.clave;


                //validar clave
                $scope.validarClave(function(){
                  //valido
                  comun.guardarUsuario($scope.usuario, function(_und) {
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
                    comun.editarUsuario($scope.usuario, function(_und) {
                        $uibModalInstance.close(_und);
                    });
                  });
                } else{
                    // no validar clave
                    comun.editarUsuario($scope.usuario, function(_und) {
                        $uibModalInstance.close(_und);
                    });

                }

            }
        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    }).controller("popupEliminarCtrl", function($scope, $http, $uibModalInstance, usuario, comun) {
        $scope.usuario = usuario;

        $scope.eliminar = function() {
            $scope.usuario.properties.estado = "E"; // e de eliminado
            comun.editarUsuario($scope.usuario, function(_und) {
                $uibModalInstance.close(_und);
            });
        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    });

})();
