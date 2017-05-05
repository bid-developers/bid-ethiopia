/**
 * Load Module Depencencies
 */
var mongoose = require('mongoose');
var paginate  = require('mongoose-paginate');
var Schema = mongoose.Schema;

//Creating schema for customer
var CustomerSchema = new Schema({
     profile:            { type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},
     date_created:   { type: Date },
     last_modified: { type: Date }
},{versionKey: false});

CustomerSchema.plugin(paginate);

module.exports = mongoose.model('Customer', CustomerSchema);