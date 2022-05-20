var express = require('express');
var router = express.Router();
const postController = require('../controller/PostController');
const userController = require('../controller/UserController')
/* GET home page. */

//gets home page which gets the 5 most recent posts
router.get('/',postController.index);
//gets all the posts
router.get('/posts', postController.posts_get);
//gets a certain post and its comments
router.get('/posts/:id',postController.get_post_by_id);

router.post('/signup',userController.user_signup_post);

router.post('/login', userController.user_login_post);





module.exports = router;
