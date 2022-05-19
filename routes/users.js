var express = require('express');
var router = express.Router();
const userController = require('../controller/UserController')

/* GET users listing. */

router.post('/signup',userController.user_signup_post);

router.post('/login', userController.user_login_post);



module.exports = router;
