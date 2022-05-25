const {body,validationResult,check} = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const async = require('async');

exports.protected_get = function (req,res, next){
  return res.status(200).send('WE GOT TO THE PROTECTED ROUTE')
}