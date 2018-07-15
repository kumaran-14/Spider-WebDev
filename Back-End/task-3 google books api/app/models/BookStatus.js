const mongoose = require('mongoose');

const BookStatusSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  volume_id: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  detail_obj:{
    type:Object,
    required:true
  }
})

module.exports = mongoose.model('bookStatus', BookStatusSchema)
