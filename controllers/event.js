// Load Module Dependencies
var events       = require('events');
var debug        = require('debug')('afrikik-api');
var moment       = require('moment');
var bcrypt    = require('bcrypt');
var config    = require('../config');


var EventDal       = require('../dal/event');

/**
 * Validate Events
 */
/**
 * @disc EventID id validation interface
 * @param {id} unique EventId ID
 * @param {req} http request
 * @param {res} Http response
 * @param {next} middlware dispatcher
 */
exports.validateEvent = function validateEvent(req, res, next, id) {
  //Validate the id is mongoid or not
  req.checkParams('id', 'Invalid param').isMongoId(id);

  var validationErrors = req.validationErrors();

  if (validationErrors) {

    res.status(404).json({
      error: true,
      message: "Not Found",
      status: 404
    });

  } else {
    EventDal.get({ _id: id }, function (err, doc) {
      if (doc._id) {
        req.doc = doc._id;
        next();
      } else {
        res.status(404)
          .json({
            error: true, status: 404,
            message: 'Event _id ' + id + ' not fount'
          });
      }
    });
  }
};


/**
 * Create Event
 * 1. Validate Data
 * 2. Create Event
 * 3. Create Profile
 * 4. Create EventType(Staff / Customer)
 * 5. Response
 * 
 * @param {req} HTTP request
 * @param {res} HTTP response
 * @param {next} middlware dispatcher
 * 
 */

exports.createEvent = function createEvent(req, res, next) {
  debug('create Event');
  console.log("Create Event");

  var workflow = new events.EventEmitter();
  var body = req.body;


  workflow.on('validateEvent', function validateEvent() {
    debug('validate Event');
     console.log("Validate Event");
    // Validate Event Data

    //  //req.assert('password', '6 to 20 characters required').len(6, 20);
    req.checkBody('subject')
      .notEmpty().withMessage('Subject should not be empty');
    

    req.checkBody('location', 'Location Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');
    req.checkBody('event_date', 'Event Date Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');

      req.checkBody('speaker', 'Speaker Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');

    // req.checkBody('last_name')
    //   .notEmpty().withMessage('Should not be Empty');
    // req.checkBody('Event_type', 'Event Type is Invalid!')
    // //   .notEmpty().withMessage('Event Type should not be Empty')

    //   .isIn(['staff', 'customer']).withMessage('Event Type should either be customer or staff');


    var validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400);
      res.json(validationErrors);

    } else {
     workflow.emit('checkEventExist');

    }

  });
  /**
   * Check for Event exist or not
   */
  workflow.on('checkEventExist', function checkEventExist() {
    
    var subject = body.subject;

    // Query DB for a Event with the given ID
    EventDal.get({subject:subject }, function cb(err, doc) {
      if (err) {
        return next(err);
      }

      // If Event find return it
      if (doc._id) {
        res.status(409);
        res.json({
          error: true,
          message: 'Event Already Exist, Pelase try for other option!',
          status: 409
        });

      } else {
     
        workflow.emit('createEvent');
      }
    });

  });
  workflow.on('createEvent', function createEvent() {

    debug('Creating Event');
      // Create Event
    EventDal.create(body, function callback(err, event) {
      if (err) {
        return next(err);
      }

      workflow.emit('respond', event);

    });

  });

  workflow.on('respond', function respond(event) {

    res.status(201);
    res.json(event);

  });

  workflow.emit('validateEvent');

};

/**
 * Get Event
 */
exports.getEvent = function getEvent(req, res, next) {
  var EventId = req.params.id;

  // Query DB for a Event with the given ID
  EventDal.get({ _id: EventId }, function cb(err, Event) {
    if (err) {
      return next(err);
    }
    // If Event find return it
    if (Event._id) {
      res.json(Event);

    } else {
      res.status(404);
      res.json({
        error: true,
        message: 'Event Requested Not Found!',
        status: 404
      });

    }
  });
};

/**
 * Update Event
 */
exports.updateEvent = function updateEvent(req, res, next) {
  var body = req.body;
  var EventId = req.params.id;

  // Update Event profile
  EventDal.update({ _id: EventId }, body, function update(err, Event) {
    if (err) {
      return next(err);
    }

    if (!Event) {
      res.status(404);
      res.json({
        error: true,
        message: 'Event To Be Updated Not Found!',
        status: 404
      });
      return;

    } else {

      res.json(Event);

      console.log(Event);



    }
  });
};


/**
 * Remove Events
 */
exports.removeEvent = function removeEvent(req, res, next) {
};


/**
 * Get Events
 */
exports.getEvents = function getEvents(req, res, next) {
  // Retrieve all the Events
  EventDal.getCollection({}, function getAllEvents(err, docs) {
    if (err) {
      return next(err);
    }
  
    res.json(docs);
  });
};


// no operation(noop) function
exports.noop = function noop(req, res, next) {
  res.json({
    message: 'To Implemented!'
  });
};


//Export By Pagination
exports.getByPagination = function getByPagination(req, res, next) {

 var query ={};
 // retrieve pagination query params
 var page   = req.query.page;
 var limit  = req.query.per_page;
 var queryOpts ={
   page:page,
   limit:limit
  };
//console.log(queryOpts);
  EventDal.getCollectionBYPagination(query,queryOpts, function getByPaginationCb(err, doc) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      res.status(404),
        res.json({
          error: true,
          message: "Requested Data is not found",
          status: 404
        }
        );
    }
    res.json(doc);
  });

};


/**
 * Event Count
 */
exports.eventsCount = function eventsCount(req, res, next){
  
  EventDal.total({}, function(err, count){
     if(err){
       return next(err);
     }
     res.json({
       "total_events_count":count
     });
  });
};
