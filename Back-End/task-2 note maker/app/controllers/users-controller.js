const User = require('../models/user.js')
const path = require('path')
const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const app = express()

exports.login = (req, res) => {
  res.render('login')
}
exports.register = (req, res) => {
  res.render('register')
}

exports.addUser = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const username = req.body.username

  req.checkBody('name', "Name is Required").notEmpty()
  req.checkBody('email', "Name is Required").notEmpty()
  req.checkBody('email', "Not a Valid Email").isEmail()
  req.checkBody('username', "Name is Required").notEmpty()
  req.checkBody('password', "Name is Required").notEmpty()
  req.checkBody('password', "Password does not match").equals(req.body.password2)

  let errors = req.validationErrors()
  if (errors) {
    console.log(errors)
    res.render('register', {
      errors: errors
    })
  } else {
    let newUser = new User({
      name: name,
      email: email,
      userid: username,
      password: password
    })
    bcrypt.genSalt(10, (err, salt) => {
      if (err) console.log(err)
      else {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.log(err)
          else {
            newUser.password = hash

            newUser.save(err => {
              if (err) console.log(err)
              else {
                req.flash('success', 'Registration Complete, You can now Login')
                res.redirect('/users/login')
              }
            });
          }
        });
      }
    });
  }
};
exports.signIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'You are Logged Out now.')
  res.redirect('/users/login')
}
