#! /usr/bin/env node

console.log(
  "This script populates some test authors, posts, comments to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

//Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid mongodb URL as the first argument"
  );
  return;
}
var { faker } = require("@faker-js/faker");
var Author = require("./models/Author");
var Post = require("./models/Post");
var Comment = require("./models/Comment");
var async = require("async");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "working",
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var authors = [];
var posts = [];
var comments = [];

function createAuthors(cb) {
  var first_name = faker.name.firstName();
  var last_name = faker.name.lastName();
  var username = faker.internet.userName(first_name, last_name);

  let authorDetails = {
    first_name,
    last_name,
    username,
    password: "password",
  };

  var author = new Author(authorDetails);
  author.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    authors.push(author);
    cb(null, author);
  });
}

function createPost(author, cb) {
  var title = faker.hacker.phrase();
  var blog = faker.lorem.paragraphs(4);
  let writter = author._id;
  var timestamp = faker.date.past();

  var postDetails = {
    title,
    blog,
    timestamp,
    author: writter,
    public: true,
  };
  var newpost = new Post(postDetails);
  newpost.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    posts.push(newpost);
    cb(null, newpost);
  });
}

function createComment(post, cb) {
  var commentDetails = {
    name: faker.name.fullName(),
    message: faker.lorem.sentence(),
    post: post._id,
    timestamp: faker.date.past(),
  };

  var comment = new Comment(commentDetails);
  comment.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    cb(null, comment);
  });
}

function authorCreate(cb) {
  async.parallel(
    [
      function (callback) {
        createAuthors(callback);
      },
      function (callback) {
        createAuthors(callback);
      },
      function (callback) {
        createAuthors(callback);
      },
    ],
    cb
  );
}

function postCreate(cb) {
  async.parallel(
    [
      function (callback) {
        createPost(authors[0], callback);
      },
      function (callback) {
        createPost(authors[0], callback);
      },
      function (callback) {
        createPost(authors[1], callback);
      },
      function (callback) {
        createPost(authors[1], callback);
      },
      function (callback) {
        createPost(authors[2], callback);
      },
      function (callback) {
        createPost(authors[2], callback);
      },
      function (callback) {
        createPost(authors[2], callback);
      },
    ],
    cb
  );
}

function commentCreate(cb) {
  async.parallel(
    [
      function (callback) {
        createComment(posts[0], callback);
      },
      function (callback) {
        createComment(posts[0], callback);
      },
      function (callback) {
        createComment(posts[1], callback);
      },
      function (callback) {
        createComment(posts[2], callback);
      },
      function (callback) {
        createComment(posts[3], callback);
      },
      function (callback) {
        createComment(posts[4], callback);
      },
      function (callback) {
        createComment(posts[4], callback);
      },
      function (callback) {
        createComment(posts[5], callback);
      },
      function (callback) {
        createComment(posts[5], callback);
      },
      function (callback) {
        createComment(posts[6], callback);
      },
      function (callback) {
        createComment(posts[0], callback);
      },
      function (callback) {
        createComment(posts[1], callback);
      },
    ],
    cb
  );
}

async.series(
  [authorCreate, postCreate, commentCreate],
  function (err, results) {
    if (err) {
      console.log("FINAL ERROR:", err);
    } else {
      console.log(results);
    }
    mongoose.connection.close();
  }
);
