module.exports = function(app, passport, acl, mongoose, express,captcha) {

    //MODELOS Y CONTROLADORES
    var unidadModel = require('./models/Unidad')(app, mongoose);
    var organizacionModel = require('./models/Organizacion')(app, mongoose);
    var unidadHistorialModel = require('./models/UnidadHistorial')(app, mongoose);
    var Organizacion = mongoose.model('Organizacion');
    var TipoUnidadModel = require('./models/TipoUnidad')(app, mongoose);
    var unidadCtrl = require('./controllers/UnidadController.js');
    var organizacionCtrl = require('./controllers/OrganizacionController.js');
    var tipoUnidadCtrl = require('./controllers/TipoUnidadController.js');
    var unidadHistorialCtrl = require('./controllers/UnidadHistorialController.js');
    var userCtrl = require('./controllers/UserController.js');


    //no cache
    function nocache(req, res, next) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    }


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
      if(req.user != undefined && req.user != null){
        res.redirect('/profile');
      } else{
        res.render('../public/views/index.ejs',{
          user: req.user
        });
      }
         // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('../public/views/login.ejs', {
            message: req.flash('loginMessage'),
            user: req.user
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('../public/views/signup.ejs', {
            message: req.flash('signupMessage'),
            user: req.user
        });
    });

    //agregamos capthca.check middleware
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('../public/views/profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // TRACKING SECTION =====================
    // =====================================
    app.get('/tracking', isLoggedIn,nocache, function(req, res) {
        res.render('../public/views/tracking.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // Mantenimientos =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/mantOrganizacion', isLoggedIn, acl.middleware(1, get_user_id), function(req, res) {

        Organizacion.find(function(err, orgs) {
            if (err) {
                res.render('../public/views/mantOrganizacion/index.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    organizaciones: []
                });
            } else {
                res.render('../public/views/mantOrganizacion/index.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    organizaciones: orgs
                });
            }
        });

    });

    //app.get('/unidad',isLoggedIn, acl.middleware(1,get_user_id),function(req,res){
    app.get('/unidad',isLoggedIn,acl.middleware(1,get_user_id),function(req,res){
      res.render('../public/views/mantUnidad/index.ejs',{
        user: req.user
      });
    });

    app.get('/usuario',isLoggedIn,acl.middleware(1,get_user_id),function(req,res){
      res.render('../public/views/mantUsuario/index.ejs',{
        user: req.user
      });
    });

    //rutas de control de accesos
    // Setting a new role
    //app.get('/allow/:user/:role', isLoggedIn, acl.middleware(1, get_user_id), function(request, response) {
    app.get('/allow/:user/:role', isLoggedIn, function(request, response) {
        acl.addUserRoles(request.params.user, request.params.role);
        response.send(request.params.user + ' is a ' + request.params.role);
    });

    // Unsetting a role
    app.get('/disallow/:user/:role', isLoggedIn, acl.middleware(1, get_user_id), function(request, response) {
        acl.removeUserRoles(request.params.user, request.params.role);
        response.send(request.params.user + ' is not a ' + request.params.role + ' anymore.');
    });


    //API ROUTES

    var routerApi = express.Router();

    //la lista de usuarios no debe ser expuesta

    routerApi.route('/users/:idOrganizacion').get(userCtrl.findByOrganizacion);

    //usuario logueado
    //usuarios
    routerApi.route('/user').get(userCtrl.getUserSession).post(userCtrl.add);
    routerApi.route('/user/:id').get(userCtrl.findById).put(userCtrl.update);
    routerApi.route('/user/cambiarClave/:id').post(userCtrl.cambiarClave);
    routerApi.route('/user/email/:email').get(userCtrl.findByEmail);



    //lista completa de unidades
    routerApi.route('/unidad').get(unidadCtrl.findAll).post(unidadCtrl.add);
    //
    routerApi.route('/unidad/:id').get(unidadCtrl.findById).put(unidadCtrl.update).delete(unidadCtrl.delete);
    routerApi.route('/unidad/updatelocation/:id').put(unidadCtrl.updateLocation);


    //obtener unidades por organizacion
    routerApi.route('/organizacion/unidad/:idOrganizacion').get(unidadCtrl.findByOrganizacion);

    routerApi.route('/historial').get(unidadHistorialCtrl.findAll).post(unidadHistorialCtrl.add);

    routerApi.route('/historial/:id').get(unidadHistorialCtrl.findById).put(unidadHistorialCtrl.update).delete(unidadHistorialCtrl.delete);

    routerApi.route('/unidad/historial/:idUnidad').get(unidadHistorialCtrl.findByUnidadId);

    routerApi.route('/organizacion').get(organizacionCtrl.findAll).post(organizacionCtrl.add);

    routerApi.route('/organizacion/:id').get(organizacionCtrl.findById).put(organizacionCtrl.update).delete(organizacionCtrl.delete);

    routerApi.route('/tipounidad').get(tipoUnidadCtrl.findAll).post(tipoUnidadCtrl.add);

    routerApi.route('/tipounidad/:id').get(tipoUnidadCtrl.findById).put(tipoUnidadCtrl.update).delete(tipoUnidadCtrl.delete);


    app.use('/api', routerApi);

};

function get_user_id(request, response) {
    return request.user.id.toString();
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
