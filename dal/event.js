// Access Layer for Event Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-event');
var moment  = require('moment');

var Event        = require('../models/event');

var population = [{
  path: 'Event'
}];

/**
 * create a new Event.
 *
 * @desc  creates a new Event and saves them
 *        in the database
 *
 * @param {Object}  EventData  Data for the Event to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(eventData, cb) {
  debug('creating a new Event');

  // Create Event
  var EventModel  = new Event(eventData);

  EventModel.save(function saveEvent(err, data) {
    if (err) {
      return cb(err);
    }


    exports.get({ _id: data._id }, function (err, event) {
      if(err) {
        return cb(err);
      }

      cb(null, event);

    });

  });

};

/**
 * delete a Event
 *
 * @desc  delete data of the Event with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting Event: ', query);

  Event
    .findOne(query, returnFields)
    .populate(population)
    .exec(function deleteEvent(err, event) {
      if (err) {
        return cb(err);
      }

      if(!event) {
        return cb(null, {});
      }

      Event.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, event);

      });

    });
};

/**
 * update a Event
 *
 * @desc  update data of the Event with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating Event: ', query);

  var now = moment().toISOString();

  updates.last_modified = now;

  Event
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updateEvent(err, event) {
      if(err) {
        return cb(err);
      }

      cb(null, event || {});
    });
};

/**
 * get a Event.
 *
 * @desc get a Event with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting Event ', query);

  Event
    .findOne(query)
    .populate(population)
    .exec(function(err, event) {
      if(err) {
        return cb(err);
      }

      cb(null, event || {});
    });
};

/**
 * get a collection of Events
 *
 * @desc get a collection of Events from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
  debug('fetching a collection of Events');

 Event.find(query)
    .populate(population)
    .exec(function getEventsCollection(err, events) {
      if(err) {
        return cb(err);
      }

      return cb(null, events);
  });

};
exports.getCollectionBYPagination = function getCollectionBYPagination(query,queryOpts, cb) {

  Event.paginate(query, queryOpts, function (err, result) {
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
