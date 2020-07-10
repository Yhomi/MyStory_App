const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User =require('../models/User');

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
  }, async (accessToken,refreshToken,profile,done)=>{
    // console.log(profile);

    // get the users data from profile
    // store it in a variable newUser
      const newUser ={
        googleId:profile.id,
        displayName:profile.displayName,
        email:profile.emails[0].value,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        image:profile.photos[0].value
      }

      try {
          let userExist = await User.findOne({googleId:profile.id})
          if(userExist){
            return done(null,userExist)
          }else{
            const user = await User.create(newUser)
            return done(null,user)
          }
      } catch (err) {
            console.log(err);
      }
    }
  ))
  passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
