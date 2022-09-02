const mongoose = require("mongoose");
const Author = require("../models/Author");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

module.exports.setUp = async () => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  // eslint-disable-next-line no-console
  db.on("error", console.error.bind(console, "mongo connection error"));
};

module.exports.dropDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

module.exports.dropCollections = async () => {
  if (mongo) {
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(async (key) => {
      await collections[key].deleteMany();
    });
  }
};

module.exports.initializeData = async () => {
  try {
    const authorDetails1 = new Author({
      username: "user1",
      first_name: "name",
      last_name: "name",
      password: await bcrypt.hash("password", 10),
    });

    const author1 = await authorDetails1.save();

    const postDetails1 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: false,
    });
    const postDetails2 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: true,
    });
    const postDetails3 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: true,
    });
    const postDetails4 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: true,
    });
    const postDetails5 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: true,
    });
    const postDetails6 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: true,
    });
    const postDetails7 = new Post({
      author: author1._id,
      title: "blog 1",
      blog: "this is blog 1",
      public: false,
    });

    const post1 = await postDetails1.save();
    const post2 = await postDetails2.save();
    const post3 = await postDetails3.save();
    const post4 = await postDetails4.save();
    const post5 = await postDetails5.save();
    const post6 = await postDetails6.save();
    const post7 = await postDetails7.save();

    const commentDetail1 = new Comment({
      name: "I am a commenter",
      post: post1._id,
      message: "this is the first comment",
      timestamp: Date.now(),
    });

    const comment1 = await commentDetail1.save();

    return {
      author1,
      post1,
      post2,
      post3,
      post4,
      post5,
      post6,
      post7,
      comment1,
    };
  } catch (error) {
    console.log(error);
  }
};
