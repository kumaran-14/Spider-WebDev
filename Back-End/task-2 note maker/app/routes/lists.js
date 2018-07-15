const express = require('express');
const router = express()

const lists = require('../controllers/lists-controller.js');

router.get('/',ensureAuthenticated,lists.allLists)

router.post('/add',lists.create)

router.delete('/delete/:id', lists.delete)
// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login first');
    res.redirect('/users/login');
  }
}

module.exports = router
