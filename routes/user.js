// Load Module Dependencies
var express   =   require('express');

var user  = require('../controllers/user');
//var auth  = require('../controllers/auth');
//var authorize = require('../lib/authorize');

// Create a Router
var router = express.Router();

/**
 * @api {post} /users/signup  Signup User
 * @apiName CreateUser
 * @apiGroup User
 *
 *
 * @apiParam {String} [user_name] Users Username
 * @apiParam {String} password Users Password
 * @apiParam {string} [realem] Users Group
 * @apiParam {string} first_name Users First Name
 * @apiParam {string} last_name Users last_name 
 * @apiParam {string} email Users email
 * @apiParam {Date}   [date_of_birth] Users Date of Birth
 * @apiParam {string} [city] Users City
 * @apiParam {string} [country] Users Country
 * @apiParam {string} mobile Users Mobile
 * @apiParam {string} [gender] Users Gender
 * @apiParam {string} user_type User Type , Like Staff, customer
 * 
 * @apiParamExample Request Exmaple
 * {

    "user_name":"yonas",
    "password":"test@123",
    "user_type":"customer",
    "first_name":"yonas",
    "last_name":"engida",
    "email":"yengida@gmail.com",
    "mobile":"0930015100"

 * }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
    "_id": "589fb45b48baee02dc7c713b",
   "user_name": "Tsegaw",
    "realm": "user",
    "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
    },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
  }
 *     }
 */
router.post('/signup', user.createUser);

/**
 * @api {post} /users/login  Login
 * @apiName Login
 * @apiGroup User
 * 
 * @apiParam {String} user_name Users Username
 * @apiParam {String} password Users Password

 * @apiParamExample Request Exmaple
 * {
 *    "user_name":"afrikik-user",
 *    "password":"dhjsdhjhdjhfajf"
 * }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *       "token": "lxrF2tbwa7bCjnrMjE9P",
 *       "user": {
  *             "profile": {
  *               "_id": "58afaeb061fffb6d17477be3",
  *                    "user": "58afaea861fffb6d17477be2",
  *                    "first_name": "SIMRET MOB1",
  *                    "last_name": "yohannes",
  *                    "last_modified": "2017-02-28T20:53:23.111Z"
  *                 },
  *                 "user_name": "simret",
  *                 "last_login": "2017-03-01T03:17:35.500Z",
  *                 "realm": "user",
  *                 "role": "customer",
  *                  "status": "active",
  *                 "date_created": "2017-02-24T03:55:28.307Z",
  *                  "last_modified": "2017-03-01T03:17:35.500Z"
  *             }
  *            }
  *        }
  */
//router.post('/login', auth.login);
/**
 * @api {post} /users/passchange  Password Change
 * @apiName ChangePassword
 * @apiGroup User
 * @apiParam {String} old_password Old Password
 * @apiParam {String} password New Pasword
  * @apiParamExample Request Exmaple
 *   {
 *    "old_password":"pass@1234",
 *    "new_password":"yonas"
 *   }
 */
router.post('/passchange', user.passwordChange);

// POST /users/logout
router.post('/logout', user.noop);
/**
 * @api {get} /users Request Users information
 * @apiName Get All Users
 * @apiGroup User
 *
 *  @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
    "_id": "589fb45b48baee02dc7c713b",
    "user_name": "Tsegaw",
    "realm": "user",
      "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
       },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
  }
 *     }
 */
router.get('/' ,user.getUsers);
/**
 * @apiDescription Get Users Collection by Pagination. Use below parameters to query with pagination :- page=<RESULTS_PAGE> and 
 * per_page=<RESULTS_PER_PAGE>.
 * @api {get} /users/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Users Collection by Pagination
 * @apiName Get Users Collection
 * @apiGroup User
 * @apiSuccess {String} user_name Users Username
 * @apiSuccess {String} password Users Password
 * @apiSuccess {string} [realem] Users Group
 * @apiSuccess {string} first_name Users First Name
 * @apiSuccess {string} last_name Users last_name 
 * @apiSuccess {string} [email] Users email
 * @apiSuccess {Date}   [date_of_birth] Users Date of Birth
 * @apiSuccess {string} [city] Users City
 * @apiSuccess {string} [country] Users Country
 * @apiSuccess {string} [mobile] Users Mobile
 * @apiSuccess {string} [gender] Users Gender
 * @apiSuccess {string} user_type User Type , Like Staff, customer
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
    "_id": "589fb45b48baee02dc7c713b",
       "user_name": "Tsegaw",
    "realm": "user",
     "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
    
    },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
  }
 *     }
 */

 
router.get('/paginate',user.getByPagination)
/**
 * @apiDescription This End point is allow to get  Total Club Count Report.

 * @api {get} /users/count Total Users Count 
 * @apiName Get Total USer Count
 * @apiGroup User
 
 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
    "total_users_count  ": 1
  }
 */
router.get('/count',user.usersCount);
/**@apiDescription Get Specific User Collection. To get Sepecific user information pass id  as parameter.
 * @api {get} /users/:id Request Specific User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {string} _id Users unique ID.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *        {
    "_id": "589fb45b48baee02dc7c713b",
    "password": "passs@123@123",
    "user_name": "Tsegaw",
    "realm": "user",
     "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
   },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
  }
 *     }
 */

router.param('id',user.validateUser);

router.get('/:id', user.getUser);

/**
 * @api {put} /users/:id Update Specific User information
 * @apiName UpdateUSer
 * @apiGroup User
 *
 * @apiParam {Object} Data Update Data
 * @apiParamExample Request Exmaple
 *   {
 *    "user_name":"afrikik-user",
 *    "password":"dhjsdhjhdjhfajf"
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        {
    "_id": "589fb45b48baee02dc7c713b",
    "password": "passs@123@123",
    "user_name": "Tsegaw",
    "realm": "user",
     "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
    
    },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
  }
 *     }
 */
router.put('/:id', user.updateUser);

/**
 * @api {delete} /users/:id Delete Specific User information
 * @apiName Delete
 * @apiGroup User
 *
 * @apiParam {string} _id Users unique ID.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *        {
      "_id": "589fb45b48baee02dc7c713b",
      "user_name": "Tsegaw",
      "realm": "user",
      "profile": {
      "_id": "589fb45b48baee02dc7c713c",
      "user": "589fb45b48baee02dc7c713b",
      "first_name": "Tsegaw",
      "last_name": "Tsegaw",
      "email": "test@gmail.com",
         },
    "last_modified": "2017-02-12T01:03:23.983Z",
    "status": "active",
    "role": "staff"
     }
 *}
 */
router.delete('/:id', user.noop);

// Export Router
module.exports = router;

