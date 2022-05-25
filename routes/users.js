var express = require('express');
var router = express.Router();
const AuthorController = require('../controller/AuthorConroller');
const decoded = require('jwt-decode');
const Author = require('../models/Author');

router.get('/posts', function(req,res,next){
  const Bearertoken = (req.headers.authorization);
  const token = Bearertoken.split(' ')[1];
  const crypt = decoded(token);
  console.log(crypt.userid);

  res.send({message:"You made it to the private route", token:crypt.userid})
})

module.exports = router;
