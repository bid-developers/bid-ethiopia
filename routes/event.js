// Load Module Dependencies
var express   =   require('express');

var muscian  = require('../controllers/muscian');

// Create a Router
var router = express.Router();


router.post('/', muscian.noop);
// router.post('/upload',client.noop) ;

module.exports= router;