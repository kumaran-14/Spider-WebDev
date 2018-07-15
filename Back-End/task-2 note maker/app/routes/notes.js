const express = require('express');
const router = express()


const notes = require('../controllers/notes-controller.js');

// add a new Note to database and render /notes
router.post('/add', notes.create);

// render a view to Create a note
router.get('/create', ensureAuthenticated,notes.addNote);

// Retrieve all Notes
router.get('/', notes.findAll);

// render a view for labelview
router.get('/labelview', ensureAuthenticated,notes.labelview);

// Retrieve a single Note with noteId
router.get('/:noteId', ensureAuthenticated,notes.findOne);

// Render a view for Update note
router.get('/edit/:noteId', ensureAuthenticated,notes.edit);

// Update a Note with noteId
router.post('/edit/:noteId', notes.update);

// Delete a Note with noteId
router.delete('/:noteId', ensureAuthenticated,notes.delete);

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
