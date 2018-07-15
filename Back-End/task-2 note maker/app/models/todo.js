const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
  content:{
    type:String,
    required:true,
  },
  done:{
    type:Boolean,
    default:false,
  },
  listId:{
    type:String,
    required:true,
  }
})
module.exports = mongoose.model('todo',TodoSchema)
