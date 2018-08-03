const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user.js')
const config = require('./database-config.js')
const bcrypt = require('bcryptjs')

module.exports = function(passport){

  passport.use( new LocalStrategy((username,password,done) => {

    let query = {userid:username}
    User.findOne(query,(err,user) => {
      if (err) {
        console.log(err);
        return done(err)}
      if (!user){
        return done(null,false,{message:"Incorrect Username"})
      }
      bcrypt.compare(password,user.password,(err,isMatch) => {
        if (err) {
          console.log(err);
          throw err
        }
        if (isMatch){
          return done(null,user)
        }else{
          return done(null,false,{message:"Incorrect Password"})
        }
      })

    })
  }))
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

