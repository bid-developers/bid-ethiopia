// Load Module Dependencies
var express = require('express');

var eventRouter    = require('./event');
var userRouter = require('./user');

// Export Router Initializater
module.exports = function initRouter(app) {

  // Events Endpoint
  app.use('/events', eventRouter);
  // USers Endpoint
 app.use('/users', userRouter);

};
