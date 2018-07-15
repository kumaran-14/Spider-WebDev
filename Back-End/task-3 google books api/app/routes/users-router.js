const router = require('express').Router();
const user = require('../controllers/user-controller.js');

//middleware for destroyng session
function destroySession(req,res,next){
  if (req.session) {
    req.session.destroy(err => {
      if (err) return console.log(err)
      return next()
    })
  }
}
//routes for /user
//checking for availability of username
router.get('/validateusername/:username', user.validateUsername)

//render the register form
router.get('/register', user.registerForm)

//register a new user
router.post('/register',user.registerUser)

//render a login form
router.get('/login', destroySession, user.loginForm)

//authenticate and login a user
router.post('/login', user.loginUser)

//destroy session for user by logging out
router.get('/logout', user.logout)


module.exports = router
