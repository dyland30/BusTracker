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
                        operacion: function(){
                          return "agregar";
                        },
                        usuario: function(){
                          return {};//objeto en blanco
                        },
                        usuarios: function(){
                          return $scope.listaUsuarios;
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
                      operacion: function(){
                        return "editar";
                      },
                      usuario: function(){
                        return usuario;//objeto en blanco
                      },
                      usuarios: function(){
                        return $scope.listaUsuarios;
                      }
                  }

              });
              modalCrear.result.then(function(und) {
                  //alert(usuario._id);
                  $scope.poblarDatos();

              });

            };

            $scope.mostrarEliminarPopup = function(usuario){
              var modalEliminar = $uibModal.open({
                  animation: true,
                  templateUrl: 'popupEliminar.html',
                  controller: 'popupEliminarCtrl',
                  resolve: {
                        usuario: function(){
                        return usuario;//objeto en blanco
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
    ]).controller("popupCrearCtrl", function($scope, $http, $uibModalInstance, idOrg,operacion,usuario,usuarios, comun) {
        $scope.usuario = usuario;
        $scope.titulo = "Editar Usuario";
        $scope.fecha = new Date();
        $scope.listaUsuarios =usuarios;
        $scope.usuarioSeleccionado ={};

        //alert($scope.usuarioSeleccionado);

        if(operacion=="agregar"){
          $scope.usuario.properties = {};
          $scope.usuario.properties.fch_inicio = $scope.fecha;

          $scope.titulo = "Crear Usuario"
        } else if(operacion=="editar"){
          if($scope.usuario.properties.asignado != null && $scope.usuario.properties.asignado!=undefined)
            $scope.usuarioSeleccionado =$scope.usuario.properties.asignado;
        //  alert($scope.usuarioSeleccionado);
        }
        $scope.cmbUsuarioChange= function(){
          alert($scope.usuarioSeleccionado._id);
        };


        $scope.guardar = function() {
            //completar objeto
            if(operacion=="agregar"){
              $scope.usuario.properties.estado = "D";
              $scope.usuario.properties.idOrganizacion = idOrg;
              $scope.usuario.geometry={}
              $scope.usuario.geometry.type='Point'
              $scope.usuario.geometry.coordinates = [0, 0];
              $scope.usuario.properties.asignado = $scope.usuarioSeleccionado;

              comun.guardarUsuario($scope.usuario, function(_und) {
                  //alert(_und.id);
                  $uibModalInstance.close(_und);
              });
            } else if(operacion=="editar"){
              //Editar

              $scope.usuario.properties.asignado = $scope.usuarioSeleccionado;
              comun.editarUsuario($scope.usuario,function(_und){
                  $uibModalInstance.close(_und);
              });

            }

        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    }).controller("popupEliminarCtrl",function($scope,$http,$uibModalInstance,usuario,comun){
      $scope.usuario=usuario;

      $scope.eliminar = function(){
          $scope.usuario.properties.estado="E"; // e de eliminado
          comun.editarUsuario($scope.usuario,function(_und){
            $uibModalInstance.close(_und);
          });
      };
      $scope.cancelar = function() {
          $uibModalInstance.dismiss();
      }

    });

})();
