// Load Module Dependencies
var express   =   require('express');

var event  = require('../controllers/event');

// Create a Router
var router = express.Router();
/**
 * @api {post} /events  Create Event
 * @apiName Create Event
 * @apiGroup Event
 *
 *
 * @apiParam {String} subject Event Subjetc
 * @apiParam {String} location Event Location
 * @apiParam {Date} event_date Event Date
 * @apiParam {string} event_date Speaker On Event

 * 
 * @apiParamExample Request Exmaple
 * {
 *   "subject":"How TO improve SW Development",
 *   "location":"ADDIS ABEBA",
 *   "event_date":"1/1/2019",
 *   "event_date":"engida",
 * }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "_id": "589fb45b48baee02dc7c713b",
 *   "subject":"How TO improve SW Development",
 *   "location":"ADDIS ABEBA",
 *   "event_date":"1/1/2019",
 *   "event_date":"engida",
 * }
 */
router.post('/', event.createEvent);
/**
 * @api {get} /events  Get Events
 * @apiName Get Events
 * @apiGroup Event
 *
 *
*/
router.get('/', event.getEvents);

module.exports= router;