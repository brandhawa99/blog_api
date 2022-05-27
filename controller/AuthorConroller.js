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
 * Test protected routes 
 */
exports.protected_get = function (req,res, next){
  return res.status(200).send('WE GOT TO THE PROTECTED ROUTE')
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
        res.send({error:err})
      }
      res.send({posts:posts})
    })
}

/**
 * -----------------------------------------
 * Post a new blog for the author to the db
 * ------------------------------------------
 */
exports.post_blog = [
  (req,res,next) =>{
    const decryptedToken = getToken(req.headers.authorization);
    const post = new Post ({
      author: decryptedToken.userid,
      title :req.body.title,
      blog:req.body.blog, 
      public :req.body.public
    })

    post.save(function(err){
      if(err){
        res.send({'error_message':err});
        return next(err)
        }
      // res.redirect({postId : post._id})
    })
    res.send("POSTED")
  }
]