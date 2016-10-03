require('dotenv').config();

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    flash           = require('connect-flash');
var port = process.env.PORT || 8082;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//var configDB = require('./config/database.js');

 var acl = require('acl');

 //configurar passport
 require('./app/config/passport')(passport);


 //log requests solo en desarrollo
 app.use(morgan('dev'));

 // Middlewares
 app.use(cookieParser());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use(methodOverride());

 app.set('view engine', 'ejs');

 // required for passport
 app.use(session({ secret: process.env.SECRET })); // session secret
 app.use(passport.initialize());
 app.use(passport.session()); // persistent login sessions
 app.use(flash());

app.use('/js',express.static(__dirname+'/public/js'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/images',express.static(__dirname+'/public/images'));

// Connection to DB
mongoose.connect(process.env.DB_URI, function(err, res) {
  if(err) throw err;


  console.log('Connected to Database');
  //control de acceso
  acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
//roles
  //acl.addUserRoles('57e0419966a52c2d0843dcac', 'sysadmin');

  acl.allow([
      {
          roles:['sysadmin'],
          allows:[
              {resources:['/profile','/signup','/login','/api','/mantOrganizacion','/allow','/disallow','/unidad'], permissions:['get','put','post','delete']}
          ]
      },
      {
          roles:['user'],
          allows:[
              {resources:['/profile','/signup','/login','/unidad'], permissions:['get','put','post']}
          ]
      },
      {
          roles:['companyAdmin'],
          allows:[
              {resources:['/profile','/signup','/login','/unidad','/mantOrganizacion'], permissions:['get','put','post']}
          ]
      }
  ]);
  //routes
  require('./app/routes.js')(app, passport,acl,mongoose,express); // load our routes and pass in our app and fully configured passport

  // Import Models and controllers

  // Example Route
  /*
  var router = express.Router();
  router.get('/', function(req, res) {
    res.send("Hello world!");
  });
  app.use(router);
  */
});
// Start server
app.listen(port, function() {
  console.log("Node server running on http://localhost:3000");
});
