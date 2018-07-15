const Todo = require('../models/todo.js');
const List = require('../models/list.js');

exports.allTodos = (req, res) => {
  let listname;
  List.findById(req.params.listId, (err, list) => {
    listname = list.name

  })
  Todo.find({}, (err, todos) => {
    let mytodos = todos.filter(todo => todo.listId == req.params.listId)
    if (err) console.log(err);
    let notdonetodos = mytodos.filter(todo => !todo.done)
    let donetodos = mytodos.filter(todo => todo.done)
    res.render('todo', {
      donetodos: donetodos,
      notdonetodos: notdonetodos,
      header: listname,
      listId: req.params.listId
    })
  })
}
exports.create = (req, res) => {
  let newTodo = new Todo({
    content: req.body.todo,
    listId: req.params.listId,
    done: false
  })
  newTodo.save(err = > {
    if (err) console.log(err);
    Todo.find({}, (err, todos) => {
      req.flash('success', 'Task Added')
      res.redirect('/todos/' + req.params.listId)
    })
  })
}

exports.delete = (req, res) => {
        Todo.findByIdAndRemove(req.params.id, (err, singleTodo) => {
                          res.send('SUCCESSFULL')
  })
}
exports.changedone = (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    todo.done = !todo.done
    todo.save(err => {
      if (err) console.log(err);
      res.redirect('/todos/' + req.params.listId)
    })
  })

}