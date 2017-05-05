// Load Module Dependencies
var express     = require('express');
var bodyParser  = require('body-parser');
var debug       = require('debug')('autar-api');
var mongoose    = require('mongoose');
var expressValidator= require('express-validator');
var config      = require('./config');

var router      = require('./routes');

// Connect to Mongodb
mongoose.connect(config.MONGODB_URL);
// listen to connection event
mongoose.connection.on('connected', function mongodbConnectionListener() {
  debug('Mongodb Connected successfully');
  console.log('Mongodb Connected successfully');
});
// handle error event
mongoose.connection.on('error', function mongodbErrorListener() {
  debug('Connection to Mongodb Failed!!');
   console.log('Connection to Mongodb Failed!!');

  // Try and Reconnect
  mongoose.connect(config.MONGODB_URL);

});
// Initialize app
var app = express();

// Set Middleware
//app.use(bodyParser.json());
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
// Error Handlers
app.use(expressValidator());

//CORS -enable cross-origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set Routes
router(app);

// HANDLE NOT FOUND ERROR 
app.use(function notFoundHandler(req, res, next) {
  res.status(404);
  res.json({
    error: true,
    msg: 'Not Found',
    status: 404,
    type:"UNDEFIENDED END POINT"
  });
});
// Error Handling Middleware
app.use(function errorHandler(err, req, res, next) {
  if(err.name === 'CastError') {
    err.STATUS = 400;
  }
  res.status(err.STATUS || 500);
  res.json({
    error: true,
    message: err.message,
    type: err.name,
    status: err.STATUS || 500
  });
});

// Listen to HTTP Port
app.listen(config.HTTP_PORT, function connectionListener() {
  debug('FARMER API Server running on port %s\t', config.HTTP_PORT);
  //console.log('FARMER API Server running on port\t'+config.HTTP_PORT);
});

module.exports= app;config