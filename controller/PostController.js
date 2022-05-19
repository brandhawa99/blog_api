const {body,validationResults,check} = require('express-validator');
const res = require('express/lib/response');
const Post = require('../models/Post');


exports.index = function (req,res,next){
  Post.find()
    .sort({timestamp: -1})
    .limit(5)
    .exec(function(err, results){
      if(err){
        res.send(err);
        next(err);
      }
      res.send(results);
    })
}

exports.posts_get = function(req,res,next){
  Post.find()
    .exec(function(err,results){
      if(err){return next(err)}
      res.send(results);
    })
}

exports.get_post_by_id = function(req,res,next){
  Post.findById(req.params.id)
    .populate('comments')
    .exec(function(err, results){
      if(err){res.send(err)}
      res.send(results);
    })
}

