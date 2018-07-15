const mongoose = require('mongoose');

const BookShelfSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  volume_id: {
    type: String,
    required: true,
  },
  favourite: {
    type: Boolean,
    default:false
  },
  status:{
    type:Number,
    default:1
  },
  rating:{
    type:Number,
    default:5
  },
  detail_obj:{
    type:Object,
    required:true
  }
})

module.exports = mongoose.model('bookshelf', BookShelfSchema)
