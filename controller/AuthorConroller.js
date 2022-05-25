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

exports.protected_get = function (req,res, next){
  return res.status(200).send('WE GOT TO THE PROTECTED ROUTE')
}

exports.get_posts = function(req,res,next){
  const decryptedToken = getToken(req.headers.authorization);
  res.send({message:"You made it to the private route", token:decryptedToken.userid})
}