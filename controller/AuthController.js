const {body,validationResult,check} = require('express-validator');
const bcrypt = require('bcryptjs');
const Author = require('../models/Author');
const jwt = require('jsonwebtoken');


//When a new author signs up 
exports.author_signup_post = [

  (req,res,next) => {

    bcrypt.hash(req.body.password, 10,(err,hashed) =>{
      const author = new Author({
        first_name : req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashed,
      })
      author.save(function(err){
        if(err){
          res.status(400).send({success:false, message:'There were some errors :('})
          return next(err)
        }
        const id = author._id
        const opts = {}
        opts.expiresIn = 60*60*24*5
        const secret = process.env.SECRET;
        const token = jwt.sign({"userid":id},secret,opts);
        return res.send({success:true, user:author, token:"Bearer "+token})
      })
      if(err){
        res.status(400).send({success:false, message:'There were some errors :('})        
        return next(err)
      }
    })
  }
]

//When an existing author logs in 
exports.author_login_post = [

  (req,res,next)=>{
   
    try {
      Author.findOne({'username':req.body.username},function(err,user){
        if(err){return next(err)}
        if(!user){return res.status(401).json({message:"username not found"})}
        bcrypt.compare(req.body.password, user.password,(err,pass)=>{
          const expiresIn = 60*60*24*5+Date.now();
          const opts = {}
          opts.expiresIn = expiresIn;
          const secret = process.env.SECRET;
          const token = jwt.sign({"userid":user._id},secret,opts);
          if(err){return next(err)}
          if(pass){
            res.status(200).json({success:true, token: "Bearer "+token,expiresIn:expiresIn})
          }
        })
      })  
    } catch (error) {
      res.status(404).json({success:false})
      // res.redirect('../author/posts').json({message:"auth failed"})
      return next(err);
    }
  },  
  // passport.authenticate('jwt',{
  //   successRedirect:'../user/posts',
  //   failureRedirect: '/login'
  // })

]

