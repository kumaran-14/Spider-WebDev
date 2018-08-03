const Note = require('../models/note.js')
const Tag = require('../models/tag.js')
var upload = require('../routes/upload.js');

//render a view for new note creation
exports.addNote = (req, res) => {
  res.render('add_note', {
    header: 'New Note'
  })
}
//submit a note
exports.create = (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
      res.redirect('/notes/create');
    } else {
      if (req.file == undefined) {
        req.checkBody('content', 'Content Required').notEmpty()
        let errors = req.validationErrors();
        if (errors) {
          res.render('add_note', {
            header: 'New Note',
            errors: errors
          })
        } else {
          let inputTags = req.body.tags.trim().split(/ +/)

          let newNote = new Note({
            title: req.body.title || "Untitled Note",
            content: req.body.content,
            userid: req.user._id,
            path: 'none',
            caption: req.body.caption,
            tags: inputTags
          })
          logic(inputTags, newNote);
          newNote.save(err => {
            if (err) console.log(err)
            req.flash('success', 'Note Added')
            res.redirect('/notes');
          })
        }
      } else {
        req.checkBody('content', 'Content Required').notEmpty()
        let errors = req.validationErrors();
        if (errors) {
          req.render('add_note', {
            header: 'New Note',
            errors: errors
          })
        } else {
          let inputTags = req.body.tags.trim().split(/ +/)
          var fullPath = "files/" + req.file.filename;
          let newImageNote = new Note({
            title: req.body.title || "Untitled Note",
            content: req.body.content,
            userid: req.user._id,
            path: fullPath,
            caption: req.body.caption,
            tags: inputTags
          });
          logic(inputTags, newImageNote)

          newImageNote.save(function(error) {
            if (error) {
              throw error;
            }
            req.flash('success', 'Note Added')
            res.redirect('/notes');
          });
        }
      }
    }
  });
}
//show all notes
exports.findAll = (req, res) => {
  Note.find()
    .then(notes => {
      res.render('allnotes', {
        notes: notes,
        header: 'Your Notes'
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes."
      });
    });
}

// view by labels
exports.labelview = (req, res) => {
  Note.find({}, (err, notes) => {
    if (err) console.log(err);
    Tag.find({}, (err, tags) => {
      if (err) console.log(err);
      res.render('labelnotes', {
        notes: notes,
        tagDocuments: tags,
        header: 'List By Tags'
      })
    })
  })
}


//show single note
exports.findOne = (req, res) => {
  Note.findById(req.params.noteId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.render('note', {
        header: 'NimbleNote',
        note: note
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      return res.status(500).send({
        message: "Error retrieving note with id " + req.params.noteId
      });
    });
}

//view for editing
exports.edit = (req, res) => {
  Note.findById(req.params.noteId, (err, note) => {
    if (err) return next(err)
    res.render('edit_note', {
      note: note,
      header: 'Edit Note'
    })
  })
}
// Edit a single note
exports.update = (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
      res.redirect('/notes/create');
    } else {
      if (req.file == undefined) {
        req.checkBody('content', 'Content Required').notEmpty()
        let errors = req.validationErrors();
        if (errors) {
          req.render('add_note', {
            header: 'New Note',
            errors: errors
          })
        } else {
          let inputTags = req.body.tags.trim().split(/ +/)
          let query = {
            _id: req.params.noteId
          }
          let note = {
            title: req.body.title || "Untitled Note",
            content: req.body.content,
            userid: req.user._id,
            path: 'none',
            caption: req.body.caption,
            tags: inputTags
          }

          removeLink(req.params.noteId)
          Note.update(query, note, (err) => {
            if (err) console.log(err);
            Note.find(query, (err, updatednote) => {

              logic(inputTags, updatednote[0])
            })
            req.flash('success', 'Note Updated')
            res.redirect('/notes')
          })
        }
      } else {
        req.checkBody('content', 'Content Required').notEmpty()
        let errors = req.validationErrors();
        if (errors) {
          req.render('add_note', {
            header: 'New Note',
            errors: errors
          })
        } else {
          var fullPath = "files/" + req.file.filename;

          let inputTags = req.body.tags.trim().split(/ +/)
          let query = {
            _id: req.params.noteId
          }
          let note = {
            title: req.body.title || "Untitled Note",
            content: req.body.content,
            userid: req.user._id,
            path: fullPath,
            caption: req.body.caption,
            tags: inputTags
          }
          removeLink(req.params.noteId)
          Note.update(query, note, (err) => {
            if (err) console.log(err);
            Note.find(query, (err, updatednote) => {

              logic(inputTags, updatednote[0])
            })
            req.flash('success', 'Note Updated')
            res.redirect('/notes')
          })
        }
      }
    }
  });
}
//delete a single note
exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      req.flash('danger', 'Note Deleted')
      res.send('DELETED THE PROFILE')
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      return res.status(500).send({
        message: "Could not delete note with id " + req.params.noteId
      });
    });
}

function createNewTag(tagname, noteId) {
  let newTag = new Tag({
    tagname: tagname,
    link: [noteId]
  })
  newTag.save();
}
//function to remove tag links
function removeLink(noteId) {
  Tag.find({}, (err, tags) => {
    tags.forEach(tag => {
      tag.link.forEach((id, i, arr) => {
        if (id == noteId) {
          arr.splice(i, 1)
          tag.save()
        }
        if (tag.link.length == 0) {
          Tag.findByIdAndRemove(tag._id, (err, tags) => {
            if (err) console.log(err);
          })
        }
      })
    })
  })
}
//function to add and update tags
function logic(inputTags, newNote) {
  Tag.find({}, (err, tags) => {
    if (tags.length == 0) {
      inputTags.forEach(tagname => {
        createNewTag(tagname, newNote._id)
      })
    } else {
      let allTagNames = tags.map(tagDocument => tagDocument.tagname)
      inputTags.forEach(inputTag => {
        if (!allTagNames.includes(inputTag)) {
          createNewTag(inputTag, newNote._id)
        } else {
          let matchedTagDocument = tags.find(tag => tag.tagname === inputTag)
          matchedTagDocument.link.push(newNote._id)
          matchedTagDocument.save()
        }
      })
    }
  })
}
