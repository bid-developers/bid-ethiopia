// Load Module Dependencies
var express   =   require('express');

var client  = require('../controllers/client');

// Create a Router
var router = express.Router();


router.post('/', client.noop);


module.exports= router;