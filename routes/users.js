var express = require('express');
var router = express.Router();
const AuthorController = require('../controller/AuthorConroller');



router.get('/posts', AuthorController.get_posts);

router.post('/posts/create', AuthorController.post_blog);

router.get('/posts/:id',AuthorController.get_single_post);

router.post('/posts/update',AuthorController.update_blogpost)

router.post('/posts/:id/delete',AuthorController.delete_blogpost);

router.post('/comment/:id/delete',AuthorController.delete_comment);

module.exports = router;
