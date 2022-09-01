var express = require("express");
var router = express.Router();
const postController = require("../controller/PostController");

/* GET home page. */

//gets home page which gets the 5 most recent posts
router.get("/", postController.index);
//gets all the posts
router.get("/posts", postController.get_posts);
//gets a certain post and its comments
router.get("/posts/:id", postController.get_post_by_id);
//post a comment under a post
router.post("/posts/:id", postController.post_comment);

module.exports = router;
