var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://localhost/BusTrackerDB', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models     = require('./models/Bus')(app, mongoose);
var BusCtrl = require('./controllers/BusController.js');

// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

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
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});
