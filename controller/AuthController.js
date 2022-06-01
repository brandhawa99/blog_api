const {body,validationResult,check} = require('express-validator');
const bcrypt = require('bcryptjs');
const Author = require('../models/Author');
const jwt = require('jsonwebtoken');


//When a new author signs up 
exports.author_signup_post = [
  body('first_name').trim().escape().isLength({min:1}).withMessage("First name is required").isAlpha().withMessage('Last name must be only letters from the alphabet'),
  body('last_name').trim().escape().isLength({min:1}).withMessage("Last name is required").isAlpha().withMessage('Last name must be only letters from the alphabet'),
  body('username').trim().escape().isLength({min:1}).withMessage("Username is required"),
  body('password').trim().escape().isLength({min:1}).withMessage("password is required"),
  body('password2').trim().escape().isLength({min:1}).withMessage("password is required"),
  check('password2','passwords do not match')
  .custom((val,{req})=>{
    if(val === req.body.password){
      return true;
    }else{
      return false;
    }
  }),
  check('username','username already exists')
  .custom(async(val)=>{
    return Author.findOne({'username':val}).then(user =>{
      if(user !== null){
        return Promise.reject("username already in use")
      }
    })
  }),

  (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(404).send({error:errors.array()})
    }


    bcrypt.hash(req.body.password, 10,(err,hashed) =>{
      const author = new Author({
        first_name : req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashed,
      })
      
      author.save(function(err){
        if(err){
          res.status(400).send({error:[{msg:'There were some errors :('}]})
          return next(err)
        }
        const id = author._id
        const opts = {}
        opts.expiresIn = 1000*60*60*24*5
        const secret = process.env.SECRET;
        const token = jwt.sign({"userid":id},secret,opts);
        return res.send({success:true, token:"Bearer "+token})
      })
      if(err){
        return res.status(400).send({error:[{msg:'There were some errors :('}]})        
      }
    })
  }
]

//When an existing author logs in 
exports.author_login_post = [
  body('username').trim().escape().isLength({min:1}).withMessage("Username is required"),
  body('password').trim().escape().isLength({min:1}).withMessage('Password is required'),

  (req,res,next)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(404).send({error:errors.array()});
      
    }
   
    try {
      Author.findOne({'username':req.body.username},function(err,user){
        if(err){return res.status(404).send({error : [err]})}
        if(!user){return res.status(404).json({error:[{msg:"username not found"}]})}
        bcrypt.compare(req.body.password, user.password,(err,pass)=>{
          const expiresIn = 1000*60*60*24*5+Date.now();
          const opts = {}
          opts.expiresIn = expiresIn;
          const secret = process.env.SECRET;
          const token = jwt.sign({"userid":user._id},secret,opts);
          if(err){return res.status(404).send({error: [{msg:'Incorrect Password.'}]})}
          if(pass){
            return res.status(200).json({success:true, token: "Bearer "+token,expiresIn:expiresIn})
          }
        })
      })  
    } catch (error) {
      res.status(404).json({error:'error'})
      return next(err);
    }
  },  
]

