// Access Layer for Profile Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-profile');
var moment  = require('moment');

var Profile        = require('../models/profile');

var population = [{
  path: 'Profile'
}];

/**
 * create a new profile.
 *
 * @desc  creates a new profile and saves them
 *        in the database
 *
 * @param {Object}  profileData  Data for the profile to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(profileData, cb) {
  debug('creating a new profile');

  // Create profile
  var profileModel  = new Profile(profileData);

  profileModel.save(function saveprofile(err, data) {
    if (err) {
      return cb(err);
    }


    exports.get({ _id: data._id }, function (err, profile) {
      if(err) {
        return cb(err);
      }

      cb(null, profile);

    });

  });

};

/**
 * delete a profile
 *
 * @desc  delete data of the profile with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting profile: ', query);

  Profile
    .findOne(query, returnFields)
    .populate(population)
    .exec(function deleteprofile(err, profile) {
      if (err) {
        return cb(err);
      }

      if(!profile) {
        return cb(null, {});
      }

      Profile.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, profile);

      });

    });
};

/**
 * update a profile
 *
 * @desc  update data of the profile with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating profile: ', query);

  var now = moment().toISOString();

  updates.last_modified = now;

  Profile
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updateprofile(err, profile) {
      if(err) {
        return cb(err);
      }

      cb(null, profile || {});
    });
};

/**
 * get a profile.
 *
 * @desc get a profile with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting profile ', query);

  Profile
    .findOne(query)
    .populate(population)
    .exec(function(err, profile) {
      if(err) {
        return cb(err);
      }

      cb(null, profile || {});
    });
};

/**
 * get a collection of profiles
 *
 * @desc get a collection of profiles from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
  debug('fetching a collection of profiles');

 Profile.find(query)
    .populate(population)
    .exec(function getprofilesCollection(err, profiles) {
      if(err) {
        return cb(err);
      }

      return cb(null, profiles);
  });

};
exports.getCollectionBYPagination = function getCollectionBYPagination(query,queryOpts, cb) {

  Profile.paginate(query, queryOpts, function (err, result) {
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages

    if (err) {
      return cb(err);
    }
    return cb(null, result);
  });
};
