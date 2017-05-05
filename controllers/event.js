// Load Module Dependencies
var events       = require('events');
var debug        = require('debug')('afrikik-api');
var moment       = require('moment');
var bcrypt    = require('bcrypt');
var config    = require('../config');


var EventDal       = require('../dal/event');

/**
 * Validate Users
 */
/**
 * @disc UserID id validation interface
 * @param {id} unique UserId ID
 * @param {req} http request
 * @param {res} Http response
 * @param {next} middlware dispatcher
 */
exports.validateUser = function validateUser(req, res, next, id) {
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
    UserDal.get({ _id: id }, function (err, user) {
      if (user._id) {
        req.user = user._id;
        next();
      } else {
        res.status(404)
          .json({
            error: true, status: 404,
            message: 'user _id ' + id + ' not fount'
          });
      }
    });
  }
};


/**
 * Create User
 * 1. Validate Data
 * 2. Create User
 * 3. Create Profile
 * 4. Create UserType(Staff / Customer)
 * 5. Response
 * 
 * @param {req} HTTP request
 * @param {res} HTTP response
 * @param {next} middlware dispatcher
 * 
 */

exports.createUser = function createUser(req, res, next) {
  debug('create user');

  var workflow = new events.EventEmitter();
  var body = req.body;


  workflow.on('validateUser', function validateUser() {
    debug('validate user');
    // Validate User Data

    //  //req.assert('password', '6 to 20 characters required').len(6, 20);
    req.checkBody('password')
      .notEmpty().withMessage('password should not be empty')
      .len(6, 20).withMessage('6 to 20 characters required');

    req.checkBody('first_name', 'First Name Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');
   req.checkBody('last_mame', 'Last Name Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');

      req.checkBody('email', 'Email Should not be empty!')
      .notEmpty().withMessage('Should not be Empty');

    // req.checkBody('last_name')
    //   .notEmpty().withMessage('Should not be Empty');
    // req.checkBody('user_type', 'User Type is Invalid!')
    // //   .notEmpty().withMessage('User Type should not be Empty')

    //   .isIn(['staff', 'customer']).withMessage('User Type should either be customer or staff');


    var validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400);
      res.json(validationErrors);

    } else {
      workflow.emit('checkUserExist');

    }

  });
  /**
   * Check for user exist or not
   */
  workflow.on('checkUserExist', function checkUserExist() {
    var user_name = body.user_name;

    // Query DB for a user with the given ID
    UserDal.get({ user_name: user_name }, function cb(err, user) {
      if (err) {
        return next(err);
      }

      // If user find return it
      if (user._id) {
        res.status(409);
        res.json({
          error: true,
          message: 'User Already Exist, Pelase try for other option!',
          status: 409
        });

      } else {
        workflow.emit('createUser');
      }
    });

  });
  workflow.on('createUser', function createUser() {

    debug('Creating user');
    // Create User
    UserDal.create({
      password: body.password,
      user_name: body.user_name,
      role: body.user_type,
      realm: body.realm ? body.realm : 'user'

    }, function callback(err, user) {
      if (err) {
        return next(err);
      }

      workflow.emit('createProfile', user);

    });

  });

  workflow.on('createProfile', function createProfile(user) {
    debug('Creating Profile');
    // Create Profile
    ProfileDal.create({
      user: user._id,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email
    }, function callback(err, profile) {
      if (err) {
        return next(err);
      }
     else {
        //  console.log(profile)
        UserDal.update({ _id: user._id }, { $set: { profile: profile._id } }, function callback2(err, user) {
          if (err) {
            return next(err);
          }
          // console.log('profile ID'+profile+'user ID'+user);
          workflow.emit('createUserType', user, profile);

        });
      }

    });

  });


  workflow.on('createUserType', function createUserType(user, profile) {
    debug('Create User Type');
    // Create User Type
    var now = moment().toISOString();
    if (body.user_type === 'staff') {
      StaffDal.create({
        profile: profile._id,
        //company: body.company
      }, function callback1(err, staff) {
        if (err) {
          return next(err);
        }



        ProfileDal.update({ _id: profile._id }, {staff: staff._id }, function updateCb(err, profile) {
          if (err) {
            return next(err);
          }
          debug(user);
          workflow.emit('respond', user);
        });

      });

    } else if (body.user_type === 'customer') {

      CustomerDal.create({
        profile: profile._id,
        date_created: now,
        last_modified: now
      }, function callback2(err, customer) {
        if (err) {
          return next(err);
        }

        ProfileDal.update({ _id: profile._id }, { customer: customer._id }, function updateCb(err, profile) {
          if (err) {
            return next(err);
          }
          workflow.emit('respond', customer);
        });


      });

    }


  });

  workflow.on('respond', function respond(user) {

    res.status(201);
    res.json(user);

  });

  workflow.emit('validateUser');

};

/**
 * Get User
 */
exports.getUser = function getUser(req, res, next) {
  var userId = req.params.id;

  // Query DB for a user with the given ID
  UserDal.get({ _id: userId }, function cb(err, user) {
    if (err) {
      return next(err);
    }
    // If user find return it
    if (user._id) {
      res.json(user);

    } else {
      res.status(404);
      res.json({
        error: true,
        message: 'User Requested Not Found!',
        status: 404
      });

    }
  });
};

/**
 * Update User
 */
exports.updateUser = function updateUser(req, res, next) {
  var body = req.body;
  var userId = req.params.id;

  // Update user profile
  UserDal.update({ _id: userId }, body, function update(err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(404);
      res.json({
        error: true,
        message: 'User To Be Updated Not Found!',
        status: 404
      });
      return;

    } else {

      res.json(user);

      console.log(user);



    }
  });
};


/**
 * Remove Users
 */
exports.removeUser = function removeUser(req, res, next) {
};


/**
 * Get Users
 */
exports.getUsers = function getUsers(req, res, next) {
  // Retrieve all the Users
  UserDal.getCollection({}, function getAllUsers(err, docs) {
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

exports.passwordChange = function passwordChange(req, res, next) {
  var body = req.body;
  var now = moment().toISOString();

  var workflow = new events.EventEmitter();

  workflow.on('validateInput', function validateInput() {
    req.checkBody('old_password', "invalid old_password")
      .notEmpty();

    req.checkBody('new_password', "invalid old_password")
      .notEmpty();

    var validationErrors = req.validationErrors();
    if (validationErrors) {
      res.json(validationErrors);
    } else {
      workflow.emit('validateUsername')
    }
  });

  workflow.on('validateUsername', function validateUsername() {
    UserDal.get({ user_name: req._user.user_name }, function getUser(err, user) {
      if (err) {
        return next(err);
      }

      if(!user._id){
        res.status(404);
        res.json({message:"user is not found"});
        return;
      }
      else{
         workflow.emit('checkPassword', user);
      }
    });

  });
  workflow.on('checkPassword', function checkPassword(user) {
    user.checkPassword(body.old_password, function check(err, isOk) {
      if (err) {
        return next(err);
      }
      if (!isOk) {
        res.status(403);
        res.json({ message: "wrong password" });
        return;
      }
      else {
        workflow.emit('changePassword', user);
      }

    });
  });
  workflow.on('changePassword', function passwordChange(user) {
    bcrypt.genSalt(config.SALT_LENGTH, function genSalt(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(body.new_password, salt, function hashPasswd(err, hash) {
        if (err) {
          return next(err);
        }


        var now = moment().toISOString();
        UserDal.update({ _id: user._id }, { password: hash, last_modified: now }, function updatepass(err, user) {
          if (err) {
            return next(err);
          }
          else {
            workflow.emit('respond');
          }
        });// end of update

      });// end of hash


    });// end of gensalt

  });
  workflow.on('respond', function respond() {
    res.json({ message: "Sucessfully changed." })
  });
  workflow.emit('validateInput');


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
  UserDal.getCollectionBYPagination(query,queryOpts, function getByPaginationCb(err, doc) {
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
 * USer Count
 */
exports.usersCount = function usersCount(req, res, next){
  
  UserDal.total({}, function(err, count){
     if(err){
       return next(err);
     }
     res.json({
       "total_users_count":count
     });
  });
};
