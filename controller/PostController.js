const {body,validationResult} = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const async = require('async');

//Get the 5 most recent posts for the index page
exports.index = async function (req,res,next){
  try {
    const posts = await Post.find({'public': true}, 'title timestamp')
      .sort({'timestamp':1})
      .populate('author', 'first_name last_name')
      .limit(5)
      .exec(); 
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({error:"Nothing found"})
    
  } 
}

//Gets all of the posts in the database
exports.posts_get = async function(req,res,next){
  try {
    const posts = await Post.find({'public':true}, 'title blog timestamp')
      .populate('author', 'first_name last_name')
      .sort({'timestamp':1})
      .exec()
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({error:"Nothing found"})    
  }
}
//Get the specific post and all of its comments; 

exports.get_post_by_id = async function(req,res,next){


  async.parallel({
    Post: function(callback){
      Post.findById(req.params.id)
        .populate('author','first_name last_name username')
        .exec(callback);
    },
    Comments: function(callback){
      Comment.find({'post':req.params.id})
      //order the comments where the newest ones are at the top
        .sort({'timestamp':1})
        .exec(callback);
    }
  },function(err,results){
    if(err){next(err)}
    res.status(200).send({
      post:results.Post,
      date:results.Post.date,
      comments:results.Comments
    })
  })
}

// can POST comments at the bottom of the page
exports.post_comment = [
  body('name').trim().isLength({min:1}).escape().withMessage('Name required'),
  body('comment').trim().isLength({min:1}).escape().withMessage('Message Required')
    .isLength({max:750}).withMessage('Message is too long'),

  async (req,res,next) =>{
    const errors = validationResult(req)
    const comment = new Comment({
      post: req.params.id,
      name:req.body.name,
      message: req.body.comment,
    })

    if(!errors.isEmpty()){
      res.send(errors.array());
    }
    comment.save(function(err){
      if(err){return next(err)}
    })
   }


]
