(function () {
    'use strict';

    angular.module('HomologacionFamilias', ['ui.bootstrap','ngLoadingSpinner'])
        .controller('MainController', ['$http', '$scope', '$filter', '$uibModal', function ($http, $scope, $filter, $uibModal) {
            $scope.codConcesionario = '0';
            $scope.codFamilia = '0';
            $scope.codSubFamilia = '0';
            $scope.codFamiliaLap = '0';
            $scope.codSubFamiliaLap = '0';
            $scope.listaConcesionarios = [];
            $scope.listaFamiliasLap = [];
            $scope.listaSubFamiliasLap = [];
            $scope.listaFamiliasPorConcesionario = [];
            $scope.listaSubFamilias = [];
            $scope.dataArticulos = [];
            $scope.dataFamiliasHomologar = [];
            $scope.sortType = 'concesionario';
            $scope.sortReverse = false;
            $scope.familiasSeleccionadas = [];
            $scope.famSel = {};
            $scope.articulosSeleccionados = [];
            $scope.porcentajeHomologado = 0;
            $scope.mostrarBusqueda = true;
            $scope.mostrarPanelArticulos = false;
            $scope.showHideFilters = function () {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                $scope.mostrarBusqueda = !$scope.mostrarBusqueda;

            }

            $scope.buscar = function (event) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;

                $scope.buscarFamilias(false);

            };

            // cargar Familias LAP

            $scope.obtenerFamiliasLAP = function () {
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/obtenerFamiliasLap",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {}
                }).then(function mySucces(response) {
                    $scope.listaFamiliasLap = response.data.d;
                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            $scope.obtenerPorcentajeHomologado = function () {
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/obtenerPorcentaje",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {}
                }).then(function mySucces(response) {
                    $scope.porcentajeHomologado = response.data.d;
                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            // cargar sub familias lap
            $scope.obtenerSubFamiliasLAP = function () {
                //alert("obtenerSubFamiliasLAP");
                $scope.codSubFamiliaLap = '0';
                $scope.listaSubFamiliasLap = [];
                if ($scope.codFamiliaLap != '0') {
                    var codConces = $scope.codFamiliaLap.split("|")[0];
                    var codFam = $scope.codFamiliaLap.split("|")[1];

                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/obtenerSubFamiliasLap",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { cod_concesionario: codConces, cod_familia: codFam }
                    }).then(function mySucces(response) {
                        $scope.codSubFamiliaLap = '0';
                        $scope.listaSubFamiliasLap = response.data.d;

                        // alert(response.data.d);
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                } else {
                    $scope.listaSubFamiliasLap = [];

                }

            };

            // cargar concesionarios
            $scope.obtenerConcesionarios = function () {
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/obtenerConcesionarios",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {}
                }).then(function mySucces(response) {
                    $scope.listaConcesionarios = response.data.d;
                    $scope.obtenerFamiliasLAP();
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });
            };

            // obtener familias por concesionarios
            $scope.obtenerFamiliasPorConcesionario = function () {
                $scope.listaFamiliasPorConcesionario = [];
                $scope.listaSubFamilias = [];
                $scope.codFamilia = '0';
                $scope.codSubFamilia = '0';
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/obtenerFamiliasxConcesionario",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: { dscConcesionario: $scope.codConcesionario }
                }).then(function mySucces(response) {
                    $scope.codFamilia = '0';
                    $scope.codSubFamilia = '0';
                    $scope.listaSubFamilias = [];
                    $scope.listaFamiliasPorConcesionario = response.data.d;

                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            $scope.obtenerSubFamiliasPorFamilia = function () {
                $scope.listaSubFamilias = [];
                $scope.codSubFamilia = '0'
                if ($scope.codFamilia != '0') {
                    var codFam = $scope.codFamilia.split("|")[0];
                    var dscFam = $scope.codFamilia.split("|")[1];

                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/obtenerSubFamiliasxFamilia",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { codFamilia: codFam, dscFamilia: dscFam }
                    }).then(function mySucces(response) {
                        $scope.codSubFamilia = '0';
                        $scope.listaSubFamilias = response.data.d;

                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                }

            };


            $scope.buscarFamilias = function (flgBaseDatos) {
                $scope.dataFamiliasHomologar = [];
                var codFam = '0';
                var codSubFam = '0';
                var codFamLap = '0';
                var codSubFamLap = '0';
                if ($scope.codFamilia != '0') {
                    codFam = $scope.codFamilia.split("|")[0];
                }
                if ($scope.codSubFamilia != '0') {
                    codSubFam = $scope.codSubFamilia.split("|")[1];

                }
                if ($scope.codFamiliaLap != '0') {
                    codFamLap = $scope.codFamiliaLap.split("|")[1];
                }
                codSubFamLap = $scope.codSubFamiliaLap;
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/buscarFamilias",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: { dscConcesionario: $scope.codConcesionario, codFamilia: codFam, codSubFamilia: codSubFam, codFamiliaLap: codFamLap, codSubFamiliaLap: codSubFamLap, flgBD: flgBaseDatos }
                }).then(function mySucces(response) {

                    $scope.dataFamiliasHomologar = response.data.d;

                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };


            $scope.verDetalle = function (fam, event) {
                if (event != null) {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
                // alert(fam.dsc_familia + "; " + String(fam.selected) + "; " + String(fam.Deshabilitado));
                $scope.mostrarPanelArticulos = true;
                $scope.famSel = fam;
                // obtener articulos 
                $http({
                    method: "POST",
                    url: "gpv_homologacion_familias.aspx/obtenerArticulosPorFamilia",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: { codConcesionario: fam.cod_concesionario, codFamilia: fam.cod_familia, codSubFamilia: fam.cod_subfamilia }
                }).then(function mySucces(response) {

                    $scope.dataArticulos = response.data.d;

                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            $scope.ocultarDetalle = function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                $scope.mostrarPanelArticulos = false;

            };


            $scope.asignarFamilias = function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                //obtener sub familias seleccionadas
                $scope.familiasSeleccionadas = $scope.dataFamiliasHomologar.filter(function (familia) {
                    return (familia.selected == true);

                });

                //  $uibModal.open({}).open('DialogoFamilias.html');

                var modalFamilia = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    // size: "small",
                    resolve: {
                        familiasSeleccionadas: function () {
                            return $scope.familiasSeleccionadas;
                        },
                        familiasLap: function () {
                            return $scope.listaFamiliasLap;
                        }
                    }
                });

                modalFamilia.result.then(function () {
                    //cargar articulos
                    $scope.buscarFamilias(true);
                    $scope.obtenerPorcentajeHomologado();

                }, function () {

                });

            };


            $scope.asignarFamiliasArticulos = function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                //obtener sub familias seleccionadas
                $scope.articulosSeleccionados = $scope.dataArticulos.filter(function (familia) {
                    return (familia.selected == true);

                });

                //  $uibModal.open({}).open('DialogoFamilias.html');

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'AsignarArticulos.html',
                    controller: 'AsignarArticulosCtrl',
                    // size: "small",
                    resolve: {
                        articulosSeleccionados: function () {
                            return $scope.articulosSeleccionados;
                        },
                        familiasLap: function () {
                            return $scope.listaFamiliasLap;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    //cargar articulos
                    $scope.verDetalle($scope.famSel, null);
                    $scope.obtenerPorcentajeHomologado();

                }, function () {

                });

            };


            $scope.mostrarPorcentajeDetallado = function (event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;

                var porcentajeModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'porcentajeDetallado.html',
                    controller: 'porcentajeCtrl'
                    // size: "small",
                    //resolve: {
                    //    articulosSeleccionados: function () {
                    //        return $scope.articulosSeleccionados;
                    //    },
                    //    familiasLap: function () {
                    //        return $scope.listaFamiliasLap;
                    //    }
                    //}
                });

                porcentajeModal.result.then(function () {
                    //cargar articulos
                   

                }, function () {

                });




            };

            //#######################inicializar#####################################

            $scope.obtenerConcesionarios();
            $scope.obtenerPorcentajeHomologado();

        }]).controller('ModalInstanceCtrl', function ($scope, $http, $uibModalInstance, familiasSeleccionadas, familiasLap) {
            // Asignación de Familias

            $scope.familiasSeleccionadas = familiasSeleccionadas;
            $scope.familiasLap = familiasLap;
            $scope.subfamiliasLap = [];
            $scope.codFamLapAsignar = '0';
            $scope.codSubFamLapAsignar = '0';
            $scope.opcionHomologar = "sin_asignar";

            $scope.ok = function () {
                // asignar familias

                //mostrar alerta en caso que la opción homologar 


                if ($scope.codFamLapAsignar != null && $scope.codSubFamLapAsignar != null
                    && $scope.codFamLapAsignar != '0' && $scope.codSubFamLapAsignar != '0') {
                    // actualizar articulos
                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/asignarFamiliasSubFamilia",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { familiasSeleccionadas: angular.toJson($scope.familiasSeleccionadas), codFamiliaLap: $scope.codFamLapAsignar, codSubFamiliaLap: $scope.codSubFamLapAsignar, opcionHomologar: $scope.opcionHomologar }
                    }).then(function mySucces(response) {
                        // alert( response.data.d);
                        //actualizar tabla de artículos

                        // alert(response.data.d);
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                } else {

                    alert("Por favor seleccione una familia y sub familia de Lap.");
                }

                $uibModalInstance.close();
                //asignar familia 

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.obtenerSubFam = function () {
                $scope.codSubFamLapAsignar = '0';
                $scope.subfamiliasLap = [];
                if ($scope.codFamLapAsignar != '0') {

                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/obtenerSubFamiliasLap",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { cod_concesionario: '0000', cod_familia: $scope.codFamLapAsignar }
                    }).then(function mySucces(response) {
                        $scope.codSubFamLapAsignar = '0';
                        $scope.subfamiliasLap = response.data.d;

                        // alert(response.data.d);
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                }
            }

        }).controller('AsignarArticulosCtrl', function ($scope, $http, $uibModalInstance, articulosSeleccionados, familiasLap) {


            $scope.articulosSeleccionados = articulosSeleccionados;
            $scope.familiasLap = familiasLap;
            $scope.subfamiliasLap = [];
            $scope.codFamLapAsignar = '0';
            $scope.codSubFamLapAsignar = '0';

            $scope.ok = function () {
                //validar que se esté seleccionando una familia y sub familia de lap correcta
                if ($scope.codFamLapAsignar != null && $scope.codSubFamLapAsignar != null
                    && $scope.codFamLapAsignar != '0' && $scope.codSubFamLapAsignar != '0') {
                    // actualizar articulos
                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/asignarFamiliasArticulos",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { articulosSeleccionados: angular.toJson($scope.articulosSeleccionados), codFamiliaLap: $scope.codFamLapAsignar, codSubFamiliaLap: $scope.codSubFamLapAsignar }
                    }).then(function mySucces(response) {
                        // alert( response.data.d);
                        //actualizar tabla de artículos

                        // alert(response.data.d);
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                } else {

                    alert("Por favor seleccione una familia y sub familia de Lap.");
                }

                $uibModalInstance.close();
                //asignar familia a articulos 
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.obtenerSubFam = function () {
                $scope.codSubFamLapAsignar = '0';
                $scope.subfamiliasLap = [];
                if ($scope.codFamLapAsignar != '0') {

                    $http({
                        method: "POST",
                        url: "gpv_homologacion_familias.aspx/obtenerSubFamiliasLap",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: { cod_concesionario: '0000', cod_familia: $scope.codFamLapAsignar }
                    }).then(function mySucces(response) {
                        $scope.codSubFamLapAsignar = '0';
                        $scope.subfamiliasLap = response.data.d;

                        // alert(response.data.d);
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                }
            }

        }).controller("porcentajeCtrl", function ($scope, $http, $uibModalInstance) {
            $scope.porcentajeTiendas = [];
            //cargar tiendas
            $http({
                method: "POST",
                url: "gpv_homologacion_familias.aspx/obtenerPorcentajePorTiendas",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: {  }
            }).then(function mySucces(response) {
              
                $scope.porcentajeTiendas = response.data.d;

                // alert(response.data.d);
            }, function myError(response) {
                $scope.mensajeError = response.statusText;
            });

            $scope.ok = function () {


                $uibModalInstance.close();
            };

        });



})();