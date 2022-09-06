const {
  body,
  header,
  param,
  validationResult,
  check,
} = require("express-validator");
const Author = require("../models/Author");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const async = require("async");
const decrypt = require("jwt-decode");

//function used to decrypt token on requests
function getToken(Bearertoken) {
  const token = Bearertoken.split(" ")[1];
  const decrypted = decrypt(token);
  return decrypted;
}

/**
 * ---------------------------------------
 * Get all the posts for the current user
 * ---------------------------------------
 */
exports.get_posts = async function (req, res) {
  try {
    const decryptedToken = getToken(req.headers.authorization);
    let posts = await Post.find({ author: decryptedToken.userid })
      .sort({ timestamp: -1 })
      .exec();
    res.status(200).send({ posts: posts });
  } catch (error) {
    res.status(404).send({ error: "couldn't get posts" });
  }
};

/**
 * -----------------------------------------
 * Post a new blog for the author to the db
 * ------------------------------------------
 */
exports.post_blog = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("title required"),
  body("blog")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("blog post is required"),
  body("public")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("public is required"),
  async (req, res) => {
    try {
      const decryptedToken = getToken(req.headers.authorization);
      const post = new Post({
        author: decryptedToken.userid,
        title: req.body.title,
        blog: req.body.blog,
        public: req.body.public,
      });
      await post.save();
      res.status(200).send({ msg: "post created", post: post });
    } catch (error) {
      res.status(400).send({ msg: "error creating post" });
    }
  },
];

exports.get_single_post = [
  param("id")
    .escape()
    .trim()
    .isLength({ min: 24 })
    .withMessage("id error")
    .isLength({ max: 24 })
    .withMessage("id error"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      const hasErrors = !errors.isEmpty();
      if (hasErrors) {
        return res.status(400).send(errors);
      }

      let results = await async.parallel({
        post: function (callback) {
          Post.findById(req.params.id, "title blog public timestamp").exec(
            callback
          );
        },
        comment: function (callback) {
          Comment.find({ post: req.params.id }, {}).exec(callback);
        },
      });
      if (results.post == null || results.comment == null) {
        throw new Error();
      }
      return res
        .status(200)
        .send({ post: results.post, comment: results.comment });
    } catch (error) {
      return res
        .status(400)
        .send({ error: "there was an error getting the post and comments" });
    }
  },
];

/**
 * -------------------------
 * Update existing blog post
 * -------------------------
 */
exports.update_blogpost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("title required"),
  body("blog")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("blog post is required"),
  body("timestamp")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("timestamp is required"),
  body("public")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("public is required"),
  body("id").trim().isLength({ min: 1 }).escape().withMessage("id is required"),

  async (req, res) => {
    try {
      const error = validationResult(req);
      const hasErrors = !error.isEmpty();
      if (hasErrors) {
        return res.status(400).send(error);
      }
      const decryptedToken = getToken(req.headers.authorization);
      let post = new Post({
        author: decryptedToken.userid,
        title: req.body.title,
        blog: req.body.blog,
        timestamp: req.body.timestamp,
        public: req.body.public,
        _id: req.body.id,
      });
      let updatePost = await Post.findByIdAndUpdate(
        req.body.id,
        post,
        {}
      ).exec();
      res.status(200).send(post);
    } catch (error) {
      res.status(400).send({ msg: "could not update post" });
    }
  },
];

/**
 * -----------------
 * Delete blog post
 * -----------------
 */

exports.delete_blogpost = [
  header("authorization").custom(async (token, { req }) => {
    try {
      const decryptedToken = getToken(token);
      let id = req.params.id + "";

      let user = await Author.findById(decryptedToken.userid).exec();
      let post = await Post.findById(id).exec();

      let same = user._id.equals(post.author);
      if (!same) {
        return Promise.reject("not authorized to delete post");
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject("there was an error");
    }
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const hasErrors = !errors.isEmpty();
      if (hasErrors) {
        return res.status(400).send(errors);
      }
      await Post.findByIdAndDelete(req.params.id).exec();
      res.status(200).send({ msg: "post deleted" });
    } catch (error) {
      res.status(400).send({ msg: "error deleting blog post" });
    }
  },
];

/**
 * ---------------------------
 * Delete comment under post
 * ---------------------------
 */
exports.delete_comment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id).exec();
    return res.status(200).send({ msg: "comment deleted" });
  } catch (error) {
    res.status(400).send({ msg: "error deleting comment" });
  }
};
