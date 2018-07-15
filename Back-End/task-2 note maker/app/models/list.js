const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
  name:String,
  userid:String,
},{
    timestamps:true
  }
)

module.exports = mongoose.model('list',ListSchema)
