var express = require('express');
var router = express.Router();
const AuthorController = require('../controller/AuthorConroller');


router.get('/posts', function(req,res,next){
  res.send('this is private')
})

module.exports = router;
