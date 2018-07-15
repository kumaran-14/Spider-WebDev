const User = require('../models/User.js')

//real time username availability
exports.validateUsername = (req, res) => {
  User.find({
    username: req.params.username
  }, (err, users) => {
    if (err) console.log(err);
    if (users.length == 0) {
      return res.send(JSON.stringify(true))
    } else {
      return res.send(JSON.stringify(false))
    }
  })
}

//render registerForm
exports.registerForm = (req, res) => {
  res.render('users/register')
}

//render registerForm
exports.loginForm = (req, res) => {
  res.render('users/login')
}

//validating captcha and creating a new user
exports.registerUser = (req, res) => {

  // checking for missing inputs
  if (!req.body.fullname || !req.body.email || !req.body.username || !req.body.password ||
    !req.body.passwordConf) {
    return res.render('users/register', {
      errors: 'Missing a input'
    })
  }
  //no input field is empty, further validating input values and checking whether username is taken or not
  if (req.body.fullname && req.body.email && req.body.username && req.body.password &&
    req.body.passwordConf) {
    //express validation
    req.checkBody('fullname', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConf', 'Passwords do not match').equals(req.body.password);
    let errors = req.validationErrors();

    if (errors) {
      return res.render('users/register', {
        errors: errors
      })
    }
    //if username already taken
    User.find({
      username: req.body.username
    }, (err, users) => {
      if (err) console.log(err);
      if (users.length != 0) {
        return res.render('users/register', {
          errors: 'Username already taken'
        })
      }
    })
    // all validation clear, proceed to create a user and store it in db
    var userData = {
      fullname:req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }
    //function to insert data into the db
    User.create(userData, function(err, user) {
      if (err) {
        return console.log(err)
      } else {
        return res.redirect('/user/login');
      }
    });
  }
}

//matching login credentials to create a new session
exports.loginUser = (req, res) => {
  //checking for missing inputs
  if (!req.body.username || !req.body.password) {
    return res.render('users/login', {
      errors: 'Missing Inputs'
    })
  }
  // no missing inputs, go for further validations
  if (req.body.username && req.body.password) {
    let username = req.body.username
    let password = req.body.password
    //checking whether username exists
    User.findOne({
      username: username
    }, (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect('/user/login')
      }
      // if user not found
      if (!user) {
        return res.render('users/login', {
          errors: 'Invalid Username'
        })
      }
      //user exists, next validate password
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.redirect('/user/login')
        }
        if (isMatch && isMatch == true) {
          // entered password is correct
          req.session.user = user
          res.redirect('/')
        } else {
          //entered password is incorrect
          res.render('users/login', {
            errors: 'Password does not match'
          })
        }
      })
    })
  } else {
    res.redirect('/user/login')
  }
}

//destroying user session once user is logged out
exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return next(err)
      else return res.redirect('/')
    })
  }
}