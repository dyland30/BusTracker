
(function() {
    'use strict';

    angular.module('IngresosApp', ['ui.bootstrap', 'ngLoadingSpinner'])
        .controller('MainController', ['$scope', '$http', '$filter', '$uibModal', function($scope, $http, $filter, $uibModal) {
            // alert("hi");

            $scope.filtro = "";
            $scope.listaPuestos = [];
            $scope.persona = {};
            $scope.vehiculo = {};
            $scope.textoPersonaVehiculo = "";
            $scope.IncluirPuestos = false;

            $scope.tipoIngreso = 619;
            $scope.tipoDocumento = 1;
            $scope.listaVisitas = [];

            $scope.visitaSeleccionada = {};

            $scope.listaAccesos = [];
            $scope.accesosSeleccionados = [];
            $scope.listaIngresosSalidas = [];
            $scope.listaPersonasSinSalida = [];

            $scope.verDetalleFacilidad = function(event) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;

                // mostrar popup ver detalle
                var modalverFacilidad = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupVerFacilidad.html',
                    controller: 'popupVerFacilidadCtrl',
                    windowClass: 'app-modal-verFacilidades',
                    // size: "small",
                    resolve: {
                        filtro: function() {
                            return $scope.filtro;
                        }
                    }
                });

                modalverFacilidad.result.then(function() {

                });





            };

            $scope.buscar = function(event) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                $scope.limpiar();

                if ($scope.filtro == "") {
                    //  alert("Por favor establecer texto de busqueda");
                    $scope.obtenerPersonasSinSalida();
                } else {


                    if ($scope.tipoDocumento == 1) {
                        // buscar persona y visitas de persona
                        $http({
                            method: "POST",
                            url: "ingresos.aspx/obtenerPersonaPorDocumento",
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            data: {
                                dsc_num_doc: $scope.filtro
                            }
                        }).then(function mySucces(response) {
                            $scope.persona = response.data.d;
                            $scope.textoPersonaVehiculo = $scope.persona.dsc_apellido_nombre;
                            //alert($scope.persona);

                            //buscar visitas
                            $scope.obtenerVisitasFacilidades();

                            // alert(response.data.d);
                        }, function myError(response) {
                            $scope.mensajeError = response.statusText;
                        });

                    } else if ($scope.tipoDocumento == 2) {
                        // buscar vehiculo por placa y visitas/facilidades vehiculares
                        $http({
                            method: "POST",
                            url: "ingresos.aspx/obtenerVehiculoPlaca",
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            data: {
                                cod_placa: $scope.filtro
                            }
                        }).then(function mySucces(response) {

                            $scope.vehiculo = response.data.d;
                            if ($scope.vehiculo != null && $scope.vehiculo != undefined) {
                                $scope.textoPersonaVehiculo = $scope.vehiculo.cod_placa + " - " + $scope.vehiculo.NombreMarca;
                            }
                            //alert($scope.persona);

                            //buscar visitas
                            $scope.obtenerVisitasFacilidades();

                            // alert(response.data.d);
                        }, function myError(response) {
                            $scope.mensajeError = response.statusText;
                        });

                    } else if ($scope.tipoDocumento == 3) {
                        //buscar persona por pase y visitas de persona
                        $http({
                            method: "POST",
                            url: "ingresos.aspx/obtenerPersonaPorPase",
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            data: {
                                dsc_numero_pase: $scope.filtro,
                                cod_puesto: $scope.puestoSeleccionado.cod_atributo
                            }
                        }).then(function mySucces(response) {
                            $scope.persona = response.data.d;

                            if ($scope.persona != null && $scope.persona != undefined && $scope.persona.cod_persona != 0) {
                                $scope.textoPersonaVehiculo = $scope.persona.dsc_apellido_nombre;
                                //alert($scope.persona);

                                $scope.obtenerVisitasFacilidades();

                            } else {

                                alert("No se encontró ningún registro");

                            }

                            // alert(response.data.d);
                        }, function myError(response) {
                            $scope.mensajeError = response.statusText;
                        });


                    } else if ($scope.tipoDocumento == 4) {

                        $scope.mostrarPopupPersonas();

                    }

                }


                //   alert($scope.tipoDocumento + " " + $scope.puestoSeleccionado.cod_atributo);



            };


            $scope.obtenerVisitasFacilidades = function() {


                $http({
                    method: "POST",
                    url: "ingresos.aspx/listarVisitaFacilidad",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        as_cod_puesto: $scope.puestoSeleccionado.cod_atributo,
                        as_TipoAut: $scope.tipoIngreso,
                        as_FiltroOpc: $scope.tipoDocumento,
                        as_textoBus: $scope.filtro
                    }
                }).then(function mySucces(response) {

                    if (response.data.d != null && response.data.d != undefined) {
                        $scope.listaVisitas = response.data.d;
                    } else {

                        $scope.listaVisitas = [];
                    }




                    //alert($scope.puestoSeleccionado.cod_atributo);
                    // alert(response.data.d);
                    if ($scope.listaVisitas.length == 1) {
                        //seleccionar visita
                        $scope.listaVisitas[0].seleccionado = true;
                        $scope.visitaseleccionada = $scope.listaVisitas[0];

                        // buscar accesos
                        $scope.obtenerAccesos($scope.visitaseleccionada);

                    }

                    //hay que evitar que muera la conexión a la base de datos
                    if ($scope.listaVisitas.length > 1) {
                        $scope.obtenerPersonasSinSalida();
                    }


                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            }

            //deseleccionar los demas accesos cuando se selecciona uno
            $scope.updateAccesos = function(acceso) {

                //alert(acceso.cod_acceso_puesto);
                if (acceso.seleccionado == true) {
                    //deseleccionar los demas
                    $scope.listaAccesos.forEach(function(ac) {
                        if (acceso.cod_acceso_puesto != ac.cod_acceso_puesto) {
                            ac.seleccionado = false;
                        }

                    });

                }
            };


            $scope.obtenerIngresosSalidas = function() {

                $http({
                    method: "POST",
                    url: "ingresos.aspx/obtenerIngresosSalidas",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        cod_autorizacion: $scope.visitaSeleccionada.cod_autorizacion,
                        tipo_autorizacion: $scope.tipoIngreso,
                        opcion_busqueda: $scope.tipoDocumento,
                        filtro: $scope.filtro
                    }
                }).then(function mySucces(response) {
                    $scope.listaIngresosSalidas = response.data.d;
                    //alert($scope.puestoSeleccionado.cod_atributo);
                    // alert(response.data.d);
                    if ($scope.listaVisitas.length == 1) {
                        $scope.obtenerPersonasSinSalida();
                    }

                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            $scope.obtenerPuestos = function() {
                $http({
                    method: "POST",
                    url: "ingresos.aspx/obtenerPuestos",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {}
                }).then(function mySucces(response) {
                    $scope.listaPuestos = response.data.d;
                    $scope.puestoSeleccionado = $scope.listaPuestos[0];
                    $scope.obtenerPersonasSinSalida();
                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };


            $scope.obtenerAccesos = function(visitaSeleccionada) {

                $scope.visitaSeleccionada = visitaSeleccionada;
                // alert($scope.visitaSeleccionada.cod_autorizacion);

                $http({
                    method: "POST",
                    url: "ingresos.aspx/listarAccesosPorVisitaFacilidad",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        cod_visitaFacilidad: $scope.visitaSeleccionada.cod_autorizacion,
                        cod_puesto: $scope.puestoSeleccionado.cod_atributo
                    }
                }).then(function mySucces(response) {
                    $scope.listaAccesos = response.data.d;

                    if ($scope.listaAccesos.length == 1) {
                        $scope.listaAccesos[0].seleccionado = true;

                    }

                    $scope.obtenerIngresosSalidas();

                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });


            };

            //obtener personas sin salida
            $scope.obtenerPersonasSinSalida = function() {
                var cod_pto = $scope.puestoSeleccionado.cod_atributo;
                if ($scope.IncluirPuestos) {
                    cod_pto = 0;
                }

                $http({
                    method: "POST",
                    url: "ingresos.aspx/listarPersonasSinSalida",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        cod_puesto: cod_pto
                    }
                }).then(function mySucces(response) {
                    $scope.listaPersonasSinSalida = response.data.d;

                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });


            };
            $scope.fnIncluirPuestos = function() {
                // alert($scope.IncluirPuestos);
                $scope.obtenerPersonasSinSalida();

            };


            $scope.cmbPuestoChange = function() {
                if ($scope.puestoSeleccionado != undefined && $scope.puestoSeleccionado.cod_atributo != undefined) {

                    //alert($scope.puestoSeleccionado.cod_atributo);
                    $scope.buscar(null);


                }

            };


            $scope.btnNuevoClick = function() {
                if ($scope.listaAccesos != undefined && $scope.listaAccesos.length > 0) {

                    $scope.accesosSeleccionados = $scope.listaAccesos.filter(function(acceso) {
                        return (acceso.seleccionado == true);

                    });

                    //  alert($scope.accesosSeleccionados);
                    $scope.mostrarPopupNuevoIngreso();
                }


            };


            $scope.limpiar = function() {
                $scope.listaAccesos = [];
                $scope.listaVisitas = [];
                $scope.accesosSeleccionados = [];
                $scope.listaIngresosSalidas = [];

            }

            $scope.mostrarPopupPersonas = function() {

                var modalPersonas = $uibModal.open({
                    animation: true,
                    templateUrl: 'popupPersonas.html',
                    controller: 'popupPersonasCtrl',
                    // size: "small",
                    resolve: {
                        filtro: function() {
                            return $scope.filtro;
                        },
                        codPuesto: function() {
                            return $scope.puestoSeleccionado.cod_atributo;
                        },
                        codTipoFacilidad: function() {
                            return $scope.tipoIngreso;
                        }
                    }
                });

                modalPersonas.result.then(function(persona) {
                    //buscar
                    //alert(persona.dsc_apellido_nombre);
                    $scope.filtro = persona.dsc_numero_docidentidad.trim();
                    $scope.tipoDocumento = 1;
                    //buscar por persona
                    $scope.buscar(null);

                });


            };


            $scope.mostrarPopupNuevoIngreso = function() {

                if ($scope.accesosSeleccionados.length == 1) {

                    var modalIngreso = $uibModal.open({
                        animation: true,
                        templateUrl: 'popupNuevoIngreso.html',
                        controller: 'popupRegistrarIngresoCtrl',
                        // size: "small",
                        resolve: {

                            cod_puesto: function() {
                                return $scope.puestoSeleccionado.cod_atributo;
                            },
                            codTipoFacilidad: function() {
                                return $scope.tipoIngreso;
                            },
                            visitaseleccionada: function() {
                                return $scope.visitaSeleccionada;
                            },
                            listaIngresos: function() {
                                return $scope.listaIngresosSalidas;
                            },
                            accesoSeleccionado: function() {
                                return $scope.accesosSeleccionados[0];
                            },
                            tipoDocumento: function() {
                                return $scope.tipoDocumento;
                            },
                            strDoc: function() {
                                return $scope.filtro;
                            },
                            cod_vehiculo: function() {
                                var cod = 0;
                                if ($scope.vehiculo != null && $scope.vehiculo != undefined && $scope.vehiculo.cod_vehiculo != undefined && $scope.vehiculo.cod_vehiculo != null) {
                                    cod = $scope.vehiculo.cod_vehiculo;
                                }
                                return cod;
                            }

                        }
                    });

                    modalIngreso.result.then(function() {
                        //buscar ingresos
                        $scope.obtenerIngresosSalidas();
                        // $scope.buscar(null);
                    });

                } else {

                    alert("Debe seleccionar un acceso");
                }

            };

            //inicializar
            $scope.obtenerPuestos();

        }]).controller("popupPersonasCtrl", function($scope, $http, $uibModalInstance, filtro, codPuesto, codTipoFacilidad) {
            $scope.filtroPersona = filtro;

            $scope.listaPersonas = [];

            $scope.buscarPersona = function(event) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;

                $http({
                    method: "POST",
                    url: "ingresos.aspx/buscarPersonaPorNombre",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: {
                        dsc_apellido_nombre: $scope.filtroPersona,
                        cod_proceso: 335,
                        cod_puesto: codPuesto,
                        cod_tipoF: codTipoFacilidad
                    }
                }).then(function mySucces(response) {
                    $scope.listaPersonas = response.data.d;

                    // alert(response.data.d);
                }, function myError(response) {
                    $scope.mensajeError = response.statusText;
                });

            };

            $scope.seleccionarPersona = function(event, persona) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;

                $uibModalInstance.close(persona);

            };

            // buscar persona al abrir popup
            $scope.buscarPersona(null);

        }).controller("popupRegistrarIngresoCtrl", function($scope, $http, $uibModalInstance, $timeout, $filter, cod_puesto,
            codTipoFacilidad, visitaseleccionada, listaIngresos, accesoSeleccionado, tipoDocumento, strDoc, cod_vehiculo) {
            $scope.clock = "cargando fecha..."; // initialise the time variable
            $scope.tickInterval = 1000 //ms

            //llenar valores iniciales

            //obtener el último ingreso y validar si tiene hora de salida
            //si no tiene hora de salida establecer tipoIngreso = 2
            //si tiene hora de salida tipoIngreso = 1
            $scope.TipoIngreso = 1;


            $scope.ultimoIngreso = listaIngresos[0];
            if ($scope.ultimoIngreso != null && $scope.ultimoIngreso != undefined) {

                var salida = $filter('date')($scope.ultimoIngreso.fch_hora_salida.slice(6, -2), 'ddMMyyyy')
                    //alert(salida);
                if (salida == "01010001") {
                    // alert("Fecha Final NULL");
                    $scope.TipoIngreso = 2;
                    $scope.txtCredencial = $scope.ultimoIngreso.NumPase;

                }

            }

            // set focus




            var tick = function() {
                $scope.clock = Date.now() // get the current time
                $timeout(tick, $scope.tickInterval); // reset the timer
            }



            // Start the timer
            $timeout(tick, $scope.tickInterval);

            //funcion registrar
            $scope.registrar = function(event) {
                if (event)
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;


                var codMovimiento = 0;
                if ($scope.ultimoIngreso != null && $scope.ultimoIngreso != undefined) {
                    codMovimiento = $scope.ultimoIngreso.cod_autorizacion_movimiento;
                }

                if ($scope.txtCredencial != undefined && $scope.txtCredencial.trim().length > 0) {

                    if ($scope.txtObservacion == undefined || $scope.txtObservacion == null) {
                        $scope.txtObservacion = "";
                    }



                    $http({
                        method: "POST",
                        url: "ingresos.aspx/registrarIngresoSalida",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: {
                            codAutMov: codMovimiento,
                            codDetAut: visitaseleccionada.cod_detalleAutorizacion,
                            tipoMov: $scope.TipoIngreso,
                            numCred: $scope.txtCredencial,
                            codAccPuesto: accesoSeleccionado.cod_acceso_puesto,
                            codPuesto: cod_puesto,
                            obsMov: $scope.txtObservacion,
                            codTipoDoc: visitaseleccionada.CodIde,
                            dscDocIde: visitaseleccionada.DocIde,
                            codVehi: cod_vehiculo,
                            codEntidadIngresa: visitaseleccionada.cod_entidad
                        }
                    }).then(function mySucces(response) {
                        $scope.mensaje = response.data.d;

                        //alert($scope.mensaje);
                        $uibModalInstance.close();
                    }, function myError(response) {
                        $scope.mensajeError = response.statusText;
                    });

                } else {

                    alert("Por favor ingrese número de pase");
                }

            };

            $scope.cancel = function(event) {
                $uibModalInstance.dismiss();
            };

            $scope.credencialKeyPress = function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) { //Enter keycode
                    // alert("click");
                    $scope.registrar(null);
                }

            }
        }).controller("popupVerFacilidadCtrl", function($scope, $http, filtro) {

            $scope.numfacilidad = filtro;


        });

})();
