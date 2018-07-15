const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
tagname:String,
link:Array
})

module.exports = mongoose.model('tag',TagSchema)
