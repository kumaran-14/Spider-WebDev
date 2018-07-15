const mongoose = require('mongoose');

const FavouritesSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  volume_id: {
    type: String,
    required: true,
  },
  detail_obj:{
    type:Object,
    required:true
  }
})

module.exports = mongoose.model('favourite', FavouritesSchema)
