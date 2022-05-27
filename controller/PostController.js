const {body,validationResult,check} = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

//Get the 5 most recent posts for the index page
exports.index = function (req,res,next){
  Post.find({'public':true})
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

//Gets all of the posts in the database
exports.posts_get = function(req,res,next){
  Post.find()
    .exec(function(err,results){
      if(err){return next(err)}
      res.send(results);
    })
}
//Get the specific post and all of its comments; 
exports.get_post_by_id = function(req,res,next){

  async.parallel({
    Post: function(callback){
      Post.findById(req.params.id)
        .exec(callback);
    },
    Comments: function(callback){
      Comment.find({'post':req.params.id})
      //order the comments where the newest ones are at the top
        .sort({timestamp:-1})
        .exec(callback);
    }
  },function(err,results){
    if(err){next(err)}
    res.send({post:results.Post,comments:results.Comments})
  })
}

// can POST comments at the bottom of the page
exports.post_comment = [
  body('name').trim().isLength({min:1}).escape().withMessage('Name required'),
  body('message').trim().isLength({min:1}).escape().withMessage('Message Required')
    .isLength({max:750}).withMessage('Message is too long'),

  (req,res,next) =>{
    const errors = validationResult(req)
    const comment = new Comment({
      post: req.params.id,
      name:req.body.name,
      message: req.body.message,
    })

    if(!errors.isEmpty()){
      res.send(errors.array());
    }
    comment.save(function(err){
      if(err){return next(err)}
    })
   }


]
