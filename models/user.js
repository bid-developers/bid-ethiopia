
'use strict';
/**
 * Load Module Depencencies
 */
var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt');
var config    = require('../config');
var moment    = require('moment');

var hidden    = require('mongoose-hidden')();
var paginate  = require('mongoose-paginate');

var Schema = mongoose.Schema;

// creating schema for user
var UserSchema = new Schema({
  profile:        { type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},
  user_name:      { type: String },
  password:       { type: String , hide: true},
  last_login:     { type: Date },
  realm:          {type:String, default:'user'},
  role:           { type: String, default: 'fans' },
  status:         {type:String, default:'active'},
  date_created:   { type: Date },
  last_modified:  { type: Date }
},{versionKey: false});

UserSchema.plugin(hidden);
//UserSchema.plugin(hidden);
UserSchema.plugin(paginate);

// Add a pre save hook
UserSchema.pre('save', function preSaveHook(next) {
  let model = this;

  bcrypt.genSalt(config.SALT_LENGTH, function genSalt(err, salt) {
    if(err) {
      return next(err);
    }

    bcrypt.hash(model.password, salt, function hashPasswd(err, hash) {
      if(err) {
        return next(err);
      }

      var now = moment().toISOString();

      model.password = hash;
      model.date_created = now;
      model.last_modified = now;

      next();

    });
  });

});

// Compare Passwords Method
UserSchema.methods.checkPassword = function checkPassword(password, cb) {
  bcrypt.compare(password, this.password, function done(err, res) {
    if(err) {
      return cb(err);
    }

    cb(null, res);
  });

};
// Expose the User Model
module.exports = mongoose.model('User', UserSchema);
