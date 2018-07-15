const BookStatus = require('../models/BookStatus.js')
const BookShelf = require('../models/BookShelf.js')
const Favourites = require('../models/Favourites.js')
const Activity = require('../models/Activity.js')
const config = require('../../config/config.js');
const request = require('request')

function retActivityObj(book,apiBook){
	return {
		username:book.username,
		volume_id:book.volume_id,
		activity:book.activity,
		detail_obj:apiBook,
	}
}

//for displaying profile
exports.displayProfilePage = (req,res) => {
	BookShelf.find({username:req.params.user},(err,shelfBooks) => {
		Favourites.find({username:req.params.user},(err,favBooks) => {
			BookStatus.find({username:req.params.user},(err,booksWithStatus) => {
				Activity.find({username:req.params.user},(err,activities) => {
					res.render('profile',{
						shelfBooks:shelfBooks,
						favBooks:favBooks,
						booksWithStatus: booksWithStatus,
						activities:activities
					})
				})
			})
		})
	})
}

exports.storeActivity = (req,res) => {
	let url = `https://www.googleapis.com/books/v1/volumes/${req.body.volume_id}?key=${config.booksApi.apiKey}`
	request(url, (err,resp,data) => {
		if (!err && resp.statusCode === 200){
			const book = JSON.parse(data)
			let newActivityObj = retActivityObj(req.body, book)
			let newActivity = new Activity(newActivityObj)
			newActivity.save(err => {
				if(err) {
					console.log(err)
					return res.send('Error, Activity not stored.')
				}
				res.send('Success, Activity stored.')
			})
		}
	})
}