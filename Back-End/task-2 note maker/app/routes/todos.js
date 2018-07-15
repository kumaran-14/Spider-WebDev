const express = require('express');
const router = express()

const todos = require('../controllers/todos-controller.js');

router.post('/:listId/check/:id',todos.changedone)

router.get('/:listId',ensureAuthenticated, todos.allTodos)

router.post('/:listId/add',todos.create)

router.delete('/delete/:id', todos.delete)


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
