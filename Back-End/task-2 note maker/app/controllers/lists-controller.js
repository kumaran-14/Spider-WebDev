const List = require('../models/list.js')

exports.allLists = (req, res) => {
  List.find({}, (err, lists) => {
    res.render('list', {
      lists: lists
    })
  })
}

exports.create = (req, res) => {
  let newList = new List({
    name: req.body.name || 'Untitled List',
    userid: req.user._id
  })
  newList.save(err => {
    if (err) console.log(err);
    req.flash('success', 'List Added')
    res.redirect('/lists')
  })
}

exports.delete = (req, res) => {
  List.findByIdAndRemove(req.params.id, (err, list) => {
    res.send('SUCCESSFULL')
  })
}
