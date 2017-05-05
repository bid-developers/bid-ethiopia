// Load Module Dependencies
var mongoose = require('mongoose');
var paginate  = require('mongoose-paginate');

// Short cut to Schema
var Schema = mongoose.Schema;

// Define Event Schema
var EventSchema = new Schema({

  subject:       { type: String },
  location:      { type: String },
  event_date:    { type: Date},
  speaker:       { type: String},
  last_modified: { type: Date },
  date_created:  { type: Date }
},{versionKey: false});

EventSchema.plugin(paginate);

// Export Event Model
module.exports = mongoose.model('Event', EventSchema);
