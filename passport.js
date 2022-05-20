const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/User');

passport.use(new LocalStrategy({
  username:'username',
  password:'password'
},
// need to changed to to decrypt password then check
  async function (username, password, cb){
    try {
      const user = await User.findOne({username:username, password:password})
      if(!user){
        return cb(null,false,{message:'Incorrect username or password'})
      }
      return cb(null, user,{message: 'Logged In Successfully'});
      
    } catch (error) {
      cb(err);
    }
  }
))


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'cats_secret'
  },
  async function(jwtPayload,cb){
    try {
        const user = await User.findById(jwtPayload.id)
        return cb(null,user);
    } catch (error) {
        return cb(error);
    }
  }

))
