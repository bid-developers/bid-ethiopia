// Access Layer for Staff Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.
/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-Staff');
var moment  = require('moment');

var Staff    = require('../models/staff');

var population = [
//     {
//     path:'profile'
// },
// {
//     path:'working_at'
// }
];

/**
 * create new Staff
 * @desc create new Staff and save into mongodb
 * @param {Object} StaffData  to create HealthCenter
 * @param {function} cb Callback for once saving is complete
 * 
 */
//Create Staff Interface
exports.create = function create(StaffData, cb) {


    debug('creating Staff');
    var StaffModel = new Staff(StaffData);

    StaffModel.save(function done(err, data) {
        if (err) {
            return cb(err);
        }
        exports.get({ _id: data._id }, function (err, Staff) {
            if (err) {
                return cb(err);
            }
            cb(null, Staff || {});
        });
    });// end of save
};


/**
 // Get Staff Interface
 *
 * @desc get a Staff with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
    debug('getting Staff ', query);

    Staff
        .findOne(query)
        .populate(population)
        .exec(function (err, doc) {
            if (err) {
                return cb(err);
            }

            cb(null, doc || {});
        });
};
/**
 * get a collection of Staff
 *
 * @desc get a collection of Staff from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
    debug('fetching a collection of Staff');
    Staff.find(query)
        .populate(population)
        .exec(function getPlayersCollection(err, Staffs) {
            if (err) {
                return cb(err);
            }
            return cb(null, Staffs);
        });

};

/**
 * update a Staff
 *
 * @desc  update data of the Staff with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating Staff: ', query);


  Staff
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updatepStaff(err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc || {});
    });
};
