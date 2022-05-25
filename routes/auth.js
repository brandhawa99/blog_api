
var express = require('express');
var router = express.Router();
const AuthController = require('../controller/AuthController')


//Sign up as an Author 
router.post('/signup',AuthController.author_signup_post);

//Log in as an author
router.post('/login',AuthController.author_login_post);

module.exports = router;
