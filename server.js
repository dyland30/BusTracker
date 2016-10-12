var cluster = require('cluster');
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function(worker) {

        // Replace the dead worker,
        // we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

    //codigo a ejecutar si nos encontramos en un proceso del worker

} else {

    require('dotenv').config();
    var express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        methodOverride = require("method-override"),
        mongoose = require('mongoose'),
        passport = require('passport'),
        flash = require('connect-flash');
    var port = process.env.PORT || 8082;
    var morgan = require('morgan');
    var cookieParser = require('cookie-parser');

    var session = require('express-session');
    var mongoSessionStore = require('connect-mongo')(session);
    //var configDB = require('./config/database.js');

    var captcha = require('captcha');

    var acl = require('acl');

    //configurar passport
    require('./app/config/passport')(passport);

    //log requests solo en desarrollo
    app.use(morgan('dev'));

    // Middlewares
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.set('view engine', 'ejs');


    app.use('/js', express.static(__dirname + '/public/js'));
    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/images', express.static(__dirname + '/public/images'));

    // Connection to DB
    mongoose.connect(process.env.DB_URI, function(err, res) {
        if (err) throw err;

        //administración de las sesiones, almacenadas en base de datos
        // required for passport
        app.use(session({
            secret: process.env.SECRET,
            name: 'HaulRadarCookie',
            store: new mongoSessionStore({
                mongooseConnection: mongoose.connection
            }),
            resave: true,
            saveUninitialized: true
        })); // session secret
        app.use(passport.initialize());
        app.use(passport.session()); // persistent login sessions
        app.use(flash());

        //captcha imagen
        app.use(captcha({ url: '/captcha.jpg', color:'#007EA7', background: 'rgb(241,247,237)' })); // captcha params




        console.log('Connected to Database');
        //control de acceso
        acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
        //roles
        //acl.addUserRoles('57e0419966a52c2d0843dcac', 'sysadmin');

        acl.allow([{
            roles: ['sysadmin'],
            allows: [{
                resources: ['/profile', '/signup', '/login', '/api', '/mantOrganizacion', '/allow', '/disallow', '/unidad','/usuario'],
                permissions: ['get', 'put', 'post', 'delete']
            }]
        }, {
            roles: ['user'],
            allows: [{
                resources: ['/profile', '/signup', '/login', '/unidad'],
                permissions: ['get', 'put', 'post']
            }]
        }, {
            roles: ['companyAdmin'],
            allows: [{
                resources: ['/profile', '/signup', '/login', '/unidad', '/mantOrganizacion'],
                permissions: ['get', 'put', 'post']
            }]
        }]);
        //routes
        require('./app/routes.js')(app, passport, acl, mongoose, express,captcha); // load our routes and pass in our app and fully configured passport

    });

    // Start server
    app.listen(port,'0.0.0.0', function() {
        console.log("Node server running on http://localhost:" + port.toString());
    });

}
