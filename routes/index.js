var express = require('express');
var router = express.Router();
const postController = require('../controller/PostController');
/* GET home page. */

//gets home page which gets the 5 most recent posts
router.get('/',postController.index);
//gets all the posts
router.get('/posts', postController.posts_get);
//gets a certain post and its comments
router.get('/posts/:id',postController.get_post_by_id);



module.exports = router;
