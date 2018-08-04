const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const signale = require('signale')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

//mongo
// const MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://kumaran-14:lakshmi2010@ds261450.mlab.com:61450/hahas', (err, client) => {
//   if(err) console.log(err);
//   db = client.db('hahas')
//   app.listen(3000,() => {
//     console.log("SERVER fired up")
//   })
// })

app.set('views', path.join(__dirname,"views"))
app.set('view engine','pug')
app.use(express.static(path.join(__dirname, 'public')));

//route handlers



app.get('/',(req,res) => {
	res.render('index')
})

app.listen(3000,() => {
	signale.success('Server started...')
})

