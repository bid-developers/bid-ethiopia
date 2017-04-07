'use strict';
// Load Module Dependencies
const mongoose = require('mongoose');
mongoose.plugin(require('mongoose-hidden')({
  defaultHidden: { _id: false, password: true, '_v': true }
}));

var HTTP_PORT  = process.env.PORT || 5000;

module.exports = {
  // HTTP PORT
  HTTP_PORT: HTTP_PORT,

  // MONGODB URL
//  MONGODB_URL: 'mongodb://localhost/geberew',
  //MONGODB_URL: 'mongodb://geberew:geberew@2017@ds117899.mlab.com:17899/geberew',
 MONGODB_URL:'mongodb://yoni:yoni@ds117899.mlab.com:17899/geberew',
    
  // SALT VALUE LENGTH
  SALT_LENGTH :11,
  
 TOKEN_LENGTH: 7

};
