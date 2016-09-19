module.exports = function(app, passport, acl) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/signup', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
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
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/mantOrganizacion', isLoggedIn, acl.middleware( 1, get_user_id ) , function(req, res) {
        res.render('./mantOrganizacion/index.ejs', {
            user : req.user,// get the user out of session and pass to template
            organizaciones: []
        });
    });

//rutas de control de accesos
// Setting a new role
   app.get( '/allow/:user/:role', isLoggedIn, acl.middleware(1, get_user_id ), function( request, response) {
       acl.addUserRoles( request.params.user, request.params.role );
       response.send( request.params.user + ' is a ' + request.params.role );
   });

   // Unsetting a role
   app.get( '/disallow/:user/:role', isLoggedIn, acl.middleware(1, get_user_id ), function( request, response) {
       acl.removeUserRoles( request.params.user, request.params.role );
       response.send( request.params.user + ' is not a ' + request.params.role + ' anymore.' );
   });

};

function get_user_id( request, response ) {

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
