const mongoose = require("mongoose");
require("dotenv").config();
const mongoDb = process.env.mongo_URI;

mongoose.connect(mongoDb, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: "working",
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
