
/**
 * Load Module Depencencies
 */
var mongoose = require('mongoose');
var paginate  = require('mongoose-paginate');
var Schema = mongoose.Schema;

// creating schema for staff
var StaffSchema = new Schema({
    profile:         { type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},
    staff_id:        {type: String},
    job_title:       {type:String},
    date_created:    { type: Date},
    last_modified:   { type: Date }
  },{versionKey: false});

  StaffSchema.plugin(paginate);

module.exports = mongoose.model('Staff',StaffSchema);