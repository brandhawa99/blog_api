const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
require('dotenv').config();

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = new JWTStrategy(opts,(jwt_payload,done) =>{
  if(jwt_payload.username == 'bawa'){
    return done(null,true)
  }
  return done(null,false);
})