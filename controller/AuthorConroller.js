const {body,validationResult,check} = require('express-validator');
const Author = require('../models/Author');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const async = require('async');
const decrypt = require('jwt-decode');


//function used to decrypt token on requests 
function getToken (Bearertoken) {
  const token = Bearertoken.split(' ')[1];
  const decrypted = decrypt(token)
  return decrypted
}

/**
 * ---------------------------------------
 * Get all the posts for the current user 
 * ---------------------------------------
 */
exports.get_posts = function(req,res,next){
  const decryptedToken = getToken(req.headers.authorization);
  Post.find({'author':decryptedToken.userid})
    .sort({'timestamp' : -1})
    .exec(function(err,posts){
      if(err){
        res.status(500).send({error:err})
      }else{
        res.send({posts:posts})
      }
    })
}

/**
 * -----------------------------------------
 * Post a new blog for the author to the db
 * ------------------------------------------
 */
exports.post_blog = [


  (req,res,next) =>{
    console.log(req.body);
    const decryptedToken = getToken(req.headers.authorization);
    const post = new Post ({
      author: decryptedToken.userid,
      title :req.body.title,
      blog:req.body.blog, 
      public :req.body.public
    });
    post.save(function(err){
      if(err){
        next(err);  
      }
    })
    res.send("success")
  }
]

exports.get_single_post = function (req,res,next){

  async.parallel({
    post: function(cb){
      Post.findById(req.params.id)
        .exec(cb)
    },
    comment: function(cb){
      Comment.find({'post':req.params.id})
        .exec(cb)
    },
  },function(err,poststuff){
    if(err){
      return res.status(404).send({error:err})
    }
    res.send({post: poststuff.post, comment: poststuff.comment})
  }
  )
}

/**
 * -------------------------
 * Update existing blog post
 * -------------------------
 */
exports.update_blogpost = [

  (req,res,next) => {
    console.log(req.body);
    console.log(req.params);
    let post = new Post({
      author:req.body.author,
      title:req.body.title,
      blog:req.body.blog,
      timestamp:req.body.timestamp,
      public: req.body.public,
      _id: req.body.id
    })

    Post.findByIdAndUpdate(req.body.id,post,{},function(err,updated){
      if(err){return next(err)}
    })
    
    res.send("success");
  }
]

/**
 * -----------------
 * Delete blog post 
 * -----------------
 */

exports.delete_blogpost = function(req,res,next) {

  Post.findByIdAndDelete(req.params.id,function(err, done){
    if(err){
      return next(err);
    }
    res.send('deleted');
  });
    
  }
  
  /**
   * ---------------------------
   * Delete comment under post
   * ---------------------------
   */
  exports.delete_comment = function(req,res,next){

    Comment.findByIdAndDelete(req.params.id,function(err,done){
      if(err){
        return res.send(err);
      }
      res.send('deleted');
    })
  }
