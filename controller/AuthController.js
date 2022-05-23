const {body,validationResult,check} = require('express-validator');
const bcrypt = require('bcryptjs');
const Author = require('../models/Author');

const jwt = require('jsonwebtoken');


exports.author_signup_post = [


  
]

exports.author_login_post = [

  (req,res,next)=>{
    let {username, password } = req.body
    console.log(req.body);

    if(username === 'bawa'){
      if(password == 'admin'){
        const opts = {};
        opts.expiresIn = 60*60*24*5;
        const secret = process.env.SECRET;
        const token = jwt.sign({username},secret,opts)
        return res.status(200).json({
          message:'auth passed',
          token
        })
      }
    }
    return res.status(401).json({message: "auth failed"})
  }
  

]

exports.protected_get = function (req,res, next){
  return res.status(200).send('WE GOT TO THE PROTECTED ROUTE')
}


