'use strict';
// Load Module Dependencies
// const mongoose = require('mongoose');
// mongoose.plugin(require('mongoose-hidden')({
//   defaultHidden: { _id: false, password: true, '_v': true }
// }));

var HTTP_PORT  = process.env.PORT || 8087;

module.exports = {
  // HTTP PORT
  HTTP_PORT: HTTP_PORT,

  // MONGODB URL
 //MONGODB_URL: 'mongodb://localhost/bid-event',
 MONGODB_URL: 'mongodb://bid:bid@ds133321.mlab.com:33321/bidbevent',
 
  // SALT VALUE LENGTH
  SALT_LENGTH :7,
  
 TOKEN_LENGTH: 7

};
