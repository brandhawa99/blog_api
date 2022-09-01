const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const Author = require("../models/Author");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//When a new author signs up
exports.author_signup_post = [
  body("first_name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("Last name must be only letters from the alphabet"),
  body("last_name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must be only letters from the alphabet"),
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username is required"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("password is required"),
  body("password2")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("password is required"),
  check("password2", "passwords do not match").custom((val, { req }) => {
    if (val === req.body.password) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }),
  check("username", "username already exists").custom(async (val) => {
    try {
      let author = await Author.findOne({ username: val }).exec();
      if (author) {
        throw new Error();
      }
      return true;
    } catch (error) {
      return Promise.reject();
    }
  }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      const hasErrors = !errors.isEmpty();
      if (hasErrors) {
        res.status(404).send({ error: errors.array() });
        return;
      }
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const author = new Author({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPass,
      });

      let newAuthor = await author.save();
      const id = newAuthor._id;
      let opts = {};
      opts.expiresIn = 1000 * 60 * 60 * 24 * 5 + Date.now();
      const secret = process.env.SECRET;
      const token = jwt.sign({ userid: id }, secret, opts);
      res.status(200).send({ success: true, token: "Bearer " + token });
    } catch (error) {
      res.status(404).send({ msg: "there was an error signing up" });
    }
  },
];

//When an existing author logs in
exports.author_login_post = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username is required"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
  check("username")
    // TODO: ADD USERNAME AND PASSWORD CHECK
    .custom(async (val, { req }) => {
      try {
        let user = await Author.findOne({ username: val }).exec();
        if (user === null) {
          throw new Error("username not found");
        }
        let passwordCheck = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!passwordCheck) {
          throw new Error(
            "incorrect password " + user.password + req.body.password
          );
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      const hasErrors = !errors.isEmpty();
      if (hasErrors) {
        res.status(400).send({ error: errors.array() });
        return;
      }
      let author = await Author.findOne({ username: req.body.username }).exec();
      let opts = {};
      const expiresIn = 1000 * 60 * 60 * 24 * 5 + Date.now();
      opts.expiresIn = expiresIn;
      const secret = process.env.SECRET;
      const token = jwt.sign({ userid: author._id }, secret, opts);
      res
        .status(200)
        .send({
          success: true,
          token: "Bearer " + token,
          expiresIn: expiresIn,
        });
    } catch (error) {
      res.status(404).send(error);
    }
  },
];
