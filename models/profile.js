// Load Module Dependencies
var mongoose = require('mongoose');
var paginate  = require('mongoose-paginate');

// Short cut to Schema
var Schema = mongoose.Schema;

// Define Profile Schema
var ProfileSchema = new Schema({
  user:          { type: Schema.Types.ObjectId, ref: 'User' },
  customer:      { type: Schema.Types.ObjectId, ref: 'Customer'},
  player:        { type: Schema.Types.ObjectId, ref: 'Player' },
  staff:         { type: Schema.Types.ObjectId, ref: 'Staff' },
  picture:       { type: String },
  first_name:    { type: String },
  last_name:     { type: String },
  email:         { type: String },
  date_of_birth: { type: Date },
  city:          { type: String },
  country:       { type: String },
  mobile:        { type: String },
  gender:        { type: String },
  bio:           { type: String },
  last_modified: { type: Date },
  date_created:  { type: Date }
},{versionKey: false});

ProfileSchema.plugin(paginate);

// Export Profile Model
module.exports = mongoose.model('Profile', ProfileSchema);
