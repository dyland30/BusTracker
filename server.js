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

var configDB = require('./config/database.js');


// Connection to DB
mongoose.connect(configDB.url, function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});
//configurar passport
require('./config/passport')(passport);



//log requests solo en desarrollo
app.use(morgan('dev'));

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'iloveqbitsoftware' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

//routes
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport




// Import Models and controllers
var models     = require('./models/Bus')(app, mongoose);
var BusCtrl = require('./controllers/BusController.js');

// Example Route
/*
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);
*/


// API routes
var routerApi = express.Router();

routerApi.route('/buses')
  .get(BusCtrl.findAll)
  .post(BusCtrl.add);

routerApi.route('/buses/:id')
  .get(BusCtrl.findById)
  .put(BusCtrl.update)
  .delete(BusCtrl.delete);

app.use('/api', routerApi);

// Start server
app.listen(port, function() {
  console.log("Node server running on http://localhost:3000");
});
