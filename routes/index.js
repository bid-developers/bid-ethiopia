// Load Module Dependencies
var express = require('express');

var clientRouter    = require('./client');
var muscianRouter = require('./muscian');
var musicRouter = require('./music');

// Export Router Initializater
module.exports = function initRouter(app) {

  // Clients Endpoint
  app.use('/clients', clientRouter);
  // Muscians Endpoint
 app.use('/muscians', muscianRouter);
  // Musics Endpoint
 app.use('/musics', musicRouter);
   
};
