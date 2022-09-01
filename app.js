var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const passport = require("passport");
const JWTStrategy = require("./strategies/jwt");
const compression = require("compression");
const helmet = require("helmet");
//connect to database
// const mongodb = process.env.mongo_URI
// mongoose.connect(mongodb,{useUnifiedTopology:true,useNewUrlParser:true});
// const db = mongoose.connection;
// db.on('error',console.error.bind(console,'mongo connection error'));

passport.use(JWTStrategy);

var indexRouter = require("./routes/index");
var authorRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.options("*", cors());
app.use(compression());
app.use(helmet());
app.use(cors());
app.disable("x-powered-by");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use(
  "/author",
  passport.authenticate("jwt", { session: false }),
  authorRouter
);
app.get("*", function (req, res) {
  res.status(404).send("what???");
});

// app.use(function(req,res,next){
//   next(createError(404))
// })
// app.use(function(err,req,res,next){
//   res.send('Error')
// })

module.exports = app;
