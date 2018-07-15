const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const dbConfig = require('./config/database-config.js');

//  initialise express
let app = express()

//database Connection
mongoose.connect(dbConfig.url)
.then(()=>{
  console.log('*****Database Connection Successfull******');
}).catch(err=>{
  console.log(err);
  console.log('Could not connect to Database. Exiting now...');
  process.exit();
})
let db = mongoose.connection

//use pug as template engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')

//set static folder
app.use(express.static(path.join(__dirname,'app','public')))

//middlewares
//bodyParser middleware
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

//Express Session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//passport config
require('./config/passport.js')(passport)
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global vari for all routes
app.get('*',(req,res,next) => {
  res.locals.user = req.user || null
  next()
})

//import routes for users
let usersRoutes = require('./app/routes/users.js')
app.use('/users',usersRoutes)

//import routes for notes
let notesRoutes = require('./app/routes/notes.js')
app.use('/notes',notesRoutes)


let todosRoutes = require('./app/routes/todos.js')
app.use('/todos',todosRoutes)

let listsRoutes = require('./app/routes/lists.js')
app.use('/lists',listsRoutes)

//bring in User model
const User = require('./app/models/user.js')
//Homepage Route
app.get('/',(req,res) => {
  User.find({},(err,users)=>{
    res.render('index',{
      header:'NimbleNotes Users',
      users:users
    })
  })

})


//setting up server
app.listen(3000,()=>{
  console.log('****SERVER UP AND RUNNING ON PORT 3000*****');
})
