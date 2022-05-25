var express = require('express');
var router = express.Router();
const AuthorController = require('../controller/AuthorConroller');



router.get('/posts', AuthorController.get_posts);

module.exports = router;
