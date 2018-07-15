const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Note'
  },
  content: {
    type: String,
    required: true
  },
  userid: String,
  path: String,
  caption: String,
  tags: Array,
}, {
  timestamps: true
})

module.exports = mongoose.model('note', NoteSchema)
