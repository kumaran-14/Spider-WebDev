const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
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
  },
  activity:{
    type:String,
    required:true
  }
})
module.exports = mongoose.model('activity', ActivitySchema)
