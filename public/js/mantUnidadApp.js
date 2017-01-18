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
            $scope.listaUsuarios =[];

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
                    //obtener usuarios
                    comun.obtenerUsuariosOrganizacion(user.idOrganizacion,function(lsUsuarios){
                        $scope.listaUsuarios =lsUsuarios;
                    });

                });
            };


            $scope.mostrarCrearPopup = function() {
                //alert("crear");
                var modalCrear = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupCrearUnidad.html',
                    controller: 'popupCrearCtrl',
                    resolve: {
                        idOrg: function() {
                            return $scope.usuario.idOrganizacion;
                        },
                        operacion: function(){
                          return "agregar";
                        },
                        unidad: function(){
                          return {};//objeto en blanco
                        },
                        usuarios: function(){
                          return $scope.listaUsuarios;
                        }
                    }

                });

                modalCrear.result.then(function(unidad) {
                    //alert(unidad._id);
                    $scope.poblarDatos();

                });

            };

            $scope.mostrarEditarPopup = function(unidad) {
              var modalCrear = $uibModal.open({
                  animation: true,
                  templateUrl: 'popupCrearUnidad.html',
                  controller: 'popupCrearCtrl',
                  resolve: {
                      idOrg: function() {
                          return $scope.usuario.idOrganizacion;
                      },
                      operacion: function(){
                        return "editar";
                      },
                      unidad: function(){
                        return unidad;//objeto en blanco
                      },
                      usuarios: function(){
                        return $scope.listaUsuarios;
                      }
                  }

              });
              modalCrear.result.then(function(und) {
                  //alert(unidad._id);
                  $scope.poblarDatos();

              });

            };

            $scope.mostrarEliminarPopup = function(unidad){
              var modalEliminar = $uibModal.open({
                  animation: true,
                  templateUrl: 'popupEliminar.html',
                  controller: 'popupEliminarCtrl',
                  resolve: {
                        unidad: function(){
                        return unidad;//objeto en blanco
                      }
                  }

              });
              modalEliminar.result.then(function(und) {
                  //alert(unidad._id);
                  $scope.poblarDatos();

              });

            };

            //iniciar
            $scope.poblarDatos();

        }
    ]).controller("popupCrearCtrl", function($scope, $http, $uibModalInstance, idOrg,operacion,unidad,usuarios, comun) {
        $scope.unidad = unidad;
        $scope.titulo = "Editar Unidad";
        $scope.fecha = new Date();
        $scope.listaUsuarios =usuarios;
        $scope.usuarioSeleccionado ={};

        //alert($scope.usuarioSeleccionado);

        if(operacion=="agregar"){
          $scope.unidad.properties = {};
          $scope.unidad.properties.fch_inicio = $scope.fecha;

          $scope.titulo = "Crear Unidad"
        } else if(operacion=="editar"){
          if($scope.unidad.properties.asignado != null && $scope.unidad.properties.asignado!=undefined)
            $scope.usuarioSeleccionado =$scope.unidad.properties.asignado;
        //  alert($scope.usuarioSeleccionado);
        }
        $scope.cmbUsuarioChange= function(){
          //alert($scope.usuarioSeleccionado._id);
        };


        $scope.guardar = function() {
            //completar objeto
            if(operacion=="agregar"){
              $scope.unidad.properties.estado = "D";
              $scope.unidad.properties.idOrganizacion = idOrg;
              $scope.unidad.geometry={}
              $scope.unidad.geometry.type='Point'
              $scope.unidad.geometry.coordinates = [0, 0];
              $scope.unidad.properties.asignado = $scope.usuarioSeleccionado;

              comun.guardarUnidad($scope.unidad, function(_und) {
                  //alert(_und.id);
                  $uibModalInstance.close(_und);
              });
            } else if(operacion=="editar"){
              //Editar

              $scope.unidad.properties.asignado = $scope.usuarioSeleccionado;
              comun.editarUnidad($scope.unidad,function(_und){
                  $uibModalInstance.close(_und);
              });

            }

        };
        $scope.cancelar = function() {
            $uibModalInstance.dismiss();
        }

    }).controller("popupEliminarCtrl",function($scope,$http,$uibModalInstance,unidad,comun){
      $scope.unidad=unidad;

      $scope.eliminar = function(){
          $scope.unidad.properties.estado="E"; // e de eliminado
          comun.editarUnidad($scope.unidad,function(_und){
            $uibModalInstance.close(_und);
          });
      };
      $scope.cancelar = function() {
          $uibModalInstance.dismiss();
      }

    });
  

})();
