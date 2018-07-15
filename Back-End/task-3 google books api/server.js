const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const config = require('./config/config.js');
const request = require('request')
const API_KEY = config.booksApi.apiKey;
//importing router
let usersRouter = require('./app/routes/users-router.js');
let searchRouter = require('./app/routes/search-router.js');
let bookshelfRouter = require('./app/routes/bookshelf-router.js');
let favouritesRouter = require('./app/routes/favourites-router.js');
let bookstatusRouter = require('./app/routes/bookstatus-router.js');
let profileRouter = require('./app/routes/profile-router.js');

//initialising express
const app = express();

//database Connection
mongoose.connect(config.mongodb.dbURI)
.then(()=>{
  console.log('*****Database Connection Successfull******');
}).catch(err=>{
  console.log(err);
  console.log('Could not connect to Database. Exiting now...');
  process.exit();
})
let db = mongoose.connection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middlewares for body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//middlewares for expressValidator
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

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

//set the lookup location of static files
app.use(express.static(path.join(__dirname, 'public')));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  secret:config.session.secretString,
  resave:true,
  saveUninitialized:false
}))
//sessionChecker middlewares
let sessionChecker = (req,res,next) =>{
  if(!req.session.user){
    res.redirect('/user/login')
  }else{
    next()
  }
}

//global variable for all routes
app.get('*',(req,res,next) => {
  res.locals.user = req.session.user || null
  next()
})

//ROUTES

//default route
app.get('/',(req,res) => {
  if(res.locals.user) {
    return res.redirect(`/home/${res.locals.user.username}`)
  }
  return res.redirect('/user/login')
})

const randomBookNames = ['Game of Thrones','Journey','Js','Photography','WildLife','War']
//random books on home page
app.get('/home/:user',sessionChecker,(req,res) => {
  let url =''
  let index = Math.floor(Math.random()*(randomBookNames.length));
  const query = randomBookNames[index]
  url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${API_KEY}`
  request(url, (err,resp,data) => {
    if (!err && resp.statusCode === 200){
      const books = JSON.parse(data)
      return res.render('home',{books:books})
    }
    if(err) {
      return res.render('home',{books:[]})
    }
  })
})

//specific routes
//for http://localhost:3000/user/
app.use('/user', usersRouter);

//for http://localhost:3000/profile/
app.use('/profile',sessionChecker ,profileRouter);

//for http://localhost:3000/search
app.use('/search', sessionChecker, searchRouter);

//for http://localhost:3000/bookshelf
app.use('/bookshelf', sessionChecker, bookshelfRouter);

//for http://localhost:3000/favourites
app.use('/favourites', sessionChecker, favouritesRouter);

//for http://localhost:3000/bookstatus
app.use('/bookstatus', sessionChecker, bookstatusRouter);

app.get('*',(req,res)=>{
  res.send('ERROR 404. PAGE NOT FOUND')
})

app.listen(3000,()=> {
  console.log('Server Started on port: 3000');
})
