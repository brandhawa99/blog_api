const {body,validationResult,check} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.user_signup_post = [
  body('username').trim().escape().isLength({min:1}).withMessage("Username is required"),
  body('password').trim().escape().isLength({errorMessage:"password must be 4 characters long", min:4}),
  body('password2').trim().escape(),
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
      return User.findOne({'username':val}).then(user =>{
        if(user !== null){
          return Promise.reject("username already in use")
        }
      })
    }),

    (req,res,next) =>{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.send({errors:errors.array()})
      }else{
        bcrypt.hash(req.body.password,10,(err,hashed)=>{
          const user = new User({
            username: req.body.username,
            password: hashed,
          }).save(err =>{
            if(err){
              res.status(400);
              return next(err)
            }
          })
        })
    }
    next();
  }
]

exports.user_login_post = [
  

  // (req,res,next) =>{
  //   passport.authenticate('local',{session:false}, (err,user,info)=>{
  //     if(err || !user){
  //       return res.status(400).json({
  //         message:'something is not right',
  //         user:user
  //       })
  //     }
  //     req.login(user,{session:false},(err) =>{
  //       // if(err){
  //       //   res.send(err);
  //       //   next(err);
  //       // }
  //       //generate a signed json web toekn with the contents of user obj
  //       const token = jwt.sign(user,'cats_secret');
  //       return res.json({user,token})

  //     })
  //   })(req,res);

  // }
]


