(function() {
    'use strict';

    angular.module('ComunApp', []).service('comun', function($http) {
        var comunObj = {};
        var _usuario = {}; // metodos privados
        var _organizacion = {};
        var _mensajeError = "";
        var _listaUnidades = {};
        var _unidad = {};
        var _listaUsuarios =[];

        comunObj.obtenerUsuario = function(callback) {

            $http({
                method: "GET",
                url: "api/user",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _usuario = response.data;
                callback(_usuario);

            }, function myError(response) {
                _mensajeError = response.statusText;
                console.log(_mensajeError);
                callback(_usuario);
            });
        };

        comunObj.obtenerUsuarioId = function(idUsuario, callback) {

            $http({
                method: "GET",
                url: "api/user/"+idUsuario,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {
                _usuario = response.data;
                callback(_usuario);
            }, function myError(response) {
                _mensajeError = response.statusText;
                console.log(_mensajeError);
                callback(_usuario);
            });
        };
        comunObj.obtenerUsuarioEmail = function(email, callback) {
            $http({
                method: "GET",
                url: "api/user/email/"+email,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {
                _usuario = response.data;
                callback(_usuario);
            }, function myError(response) {
                _mensajeError = response.statusText;
                console.log(_mensajeError);
                callback(_usuario);
            });
        };



        comunObj.obtenerUsuariosOrganizacion = function(idOrganizacion,callback) {

            $http({
                method: "GET",
                url: "api/users/"+idOrganizacion,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _listaUsuarios = response.data;
                callback(_listaUsuarios);

            }, function myError(response) {
                _mensajeError = response.statusText;
                console.log(_mensajeError);
                callback(_listaUsuarios);
            });
        };
        //guardar usuario
        comunObj.guardarUsuario = function(usuario, callback) {

            $http({
                method: "POST",
                url: "api/user/",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: angular.toJson(usuario)
            }).then(function mySucces(response) {

                _usuario = response.data;
                //  alert(response.data);
                callback(_usuario);


            }, function myError(response) {
                var mensajeError = response.statusText;
                console.log(mensajeError);
                callback(_usuario);
            });

        };

        //editar usuario
        comunObj.editarUsuario = function(usuario, callback) {

            //obtener usuario por id
            comunObj.obtenerUsuarioId(usuario._id, function(us) {
                //solo actualizar sus propiedades no la clave
                us.local.email = usuario.local.email;
                us.nombres = usuario.nombres;
                us.docId = usuario.docId;
                us.direccion = usuario.direccion;
                us.rol = usuario.rol;
                us.estado = usuario.estado;

                $http({
                    method: "PUT",
                    url: "api/user/" + usuario._id,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: angular.toJson(us)
                }).then(function mySucces(response) {

                    _usuario = response.data;

                    //  alert(response.data);
                    callback(_usuario);

                }, function myError(response) {
                    var mensajeError = response.statusText;
                    console.log(mensajeError);
                    callback(_usuario);
                });

            });

        };

        // el cambiar la clave debe ser auto servicio
        // el administrador no podrá cambiar clave de los usuarios
        // si un usuario se olvida la clave debe solicitar por correo electronico

        //cambiar clave
        comunObj.cambiarClave = function(usuario,idUsuarioLogueado,claveAct,claveNuev, callback) {

            //obtener usuario por id
            comunObj.obtenerUsuarioId(usuario._id, function(us) {
                //solo actualizar sus propiedades no la clave
                var datos = {claveAnterior: claveAct, nuevaClave: nuevaClave};

                $http({
                    method: "PUT",
                    url: "api/user/cambiarClave/" + usuario._id,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: angular.toJson(datos)
                }).then(function mySucces(response) {

                    _usuario = response.data;

                    //  alert(response.data);
                    callback(_usuario);

                }, function myError(response) {
                    var mensajeError = response.statusText;
                    console.log(mensajeError);
                    callback(_usuario);
                });

            });

        };



        comunObj.obtenerOrganizacion = function(idOrganizacion, callback) {
            $http({
                method: "GET",
                url: "api/organizacion/" + idOrganizacion,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _organizacion = response.data;
                callback(_organizacion);

            }, function myError(response) {
                _mensajeError = response.statusText;
                console.log(_mensajeError);
                callback(_organizacion);
            });


        };


        //obtener todas las unidades de la organizacion
        comunObj.obtenerUnidadesOrganizacion = function(idOrganizacion, callback) {

            //evitar que se repita la peticion

            var currentdate = new Date();
            var datetime = currentdate.getDate() + "" +
                (currentdate.getMonth() + 1) + "" +
                currentdate.getFullYear() + "" +
                currentdate.getHours() + "" +
                currentdate.getMinutes() + "" +
                currentdate.getSeconds();

            var nocache = Math.floor(Math.random() * 9999);
            $http({
                method: "GET",
                url: "api/organizacion/unidadorg/" + idOrganizacion + "?nocache=" + datetime + nocache.toString(),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _listaUnidades = response.data;
                //  alert(response.data);
                callback(_listaUnidades);


            }, function myError(response) {
                var mensajeError = response.statusText;
                console.log(mensajeError);
                callback(_listaUnidades);
            });
        };

        //guardar unidad

        comunObj.guardarUnidad = function(unidad, callback) {

            $http({
                method: "POST",
                url: "api/unidad/",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: angular.toJson(unidad)
            }).then(function mySucces(response) {

                _unidad = response.data;
                //  alert(response.data);
                callback(_unidad);


            }, function myError(response) {
                var mensajeError = response.statusText;
                console.log(mensajeError);
                callback(_unidad);
            });

        };






        //obtener Unidad por Id
        comunObj.obtenerUnidadId = function(id, callback) {
            $http({
                method: "GET",
                url: "api/unidad/" + id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function mySucces(response) {

                _unidad = response.data;
                //  alert(response.data);
                callback(_unidad);


            }, function myError(response) {
                var mensajeError = response.statusText;
                console.log(mensajeError);
                callback(_unidad);
            });

        };

        //editar unidad
        comunObj.editarUnidad = function(unidad, callback) {

            //obtener unidad por id
            comunObj.obtenerUnidadId(unidad._id, function(und) {
                //solo actualizar sus propiedades no la geometria
                und.properties = unidad.properties;

                $http({
                    method: "PUT",
                    url: "api/unidad/" + unidad._id,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: angular.toJson(und)
                }).then(function mySucces(response) {

                    _unidad = response.data;
                    //  alert(response.data);
                    callback(_unidad);

                }, function myError(response) {
                    var mensajeError = response.statusText;
                    console.log(mensajeError);
                    callback(_unidad);
                });

            });

        };


        return comunObj;

    });



})();
