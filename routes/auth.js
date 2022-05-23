
var express = require('express');
var router = express.Router();
const AuthController = require('../controller/AuthController')
const passport = require('passport');


//Sign up as an Author 
router.post('/signup',AuthController.author_signup_post);

//Log in as an author
router.post('/login',AuthController.author_login_post);

router.get('/protect', passport.authenticate('jwt',{session:false}),AuthController.protected_get);

module.exports = router;
