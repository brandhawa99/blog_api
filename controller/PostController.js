const { body, param, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const async = require("async");

//Get the 5 most recent posts for the index page
exports.index = async function (req, res, next) {
  try {
    const posts = await Post.find({ public: true }, "title timestamp")
      .sort({ timestamp: -1 })
      .populate("author", "first_name last_name")
      .limit(5)
      .exec();
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: "Nothing found" });
  }
};

//Gets all of the posts in the database
exports.get_posts = async function (req, res, next) {
  try {
    const posts = await Post.find({ public: true }, "title blog timestamp")
      .populate("author", "first_name last_name")
      .sort({ timestamp: -1 })
      .exec();
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: "Nothing found" });
  }
};
//Get the specific post and all of its comments;

exports.get_post_by_id = [
  param("id")
    .escape()
    .trim()
    .isLength({ min: 24 })
    .isLength({ max: 24 })
    .withMessage("post not found"),
  param("id", "there is no post here").custom(async (val) => {
    try {
      let post = await Post.findById(val).exec();
      if (post === null) {
        throw new Error();
      }
      return true;
    } catch (error) {
      return Promise.reject();
    }
  }),

  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      const hasErros = !errors.isEmpty();
      if (hasErros) {
        res.status(404).send({ error: errors.array() });
        return;
      }

      let results = await async.parallel({
        Post: function (callback) {
          Post.findById(req.params.id)
            .populate("author", "first_name last_name username")
            .exec(callback);
        },
        Comments: function (callback) {
          Comment.find(
            { post: req.params.id },
            "formatted_date message name timestamp"
          )
            .sort({ timestamp: -1 })
            .exec(callback);
        },
      });
      if (results.Post == null || results.Comments == null) {
        throw new Error();
      }
      res.status(200).send({
        post: results.Post,
        date: results.Post.date,
        comments: results.Comments,
      });
    } catch (error) {
      res.status(404).send({ msg: "error getting post" });
    }
  },
];
// can POST comments at the bottom of the page
exports.post_comment = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name required"),
  body("comment")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message Required")
    .isLength({ max: 750 })
    .withMessage("Message is too long"),
  param("id")
    .trim()
    .escape("bad params")
    .isLength({ min: 24 })
    .withMessage("invalid"),
  param("id").custom(async (val) => {
    try {
      let post = await Post.findById(val).exec();
      if (!post) {
        throw new Error();
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject("there is no post here");
    }
  }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      const hasErrors = !errors.isEmpty();
      if (hasErrors) {
        res.status(400).send({ errors: errors.array() });
        return;
      }
      const comment = new Comment({
        post: req.params.id,
        name: req.body.name,
        message: req.body.comment,
      });
      await comment.save();

      let comments = await Comment.find(
        { post: req.params.id },
        "formatted_date message name timestamp"
      )
        .sort({ timestamp: -1 })
        .exec();
      res.status(200).send(comments);
    } catch (error) {
      res.status(400).send({ msg: "could not get comments" });
    }
  },
];
