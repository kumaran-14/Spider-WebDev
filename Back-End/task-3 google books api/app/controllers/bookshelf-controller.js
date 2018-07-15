const BookShelf = require('../models/BookShelf.js')
const API_KEY = 'AIzaSyDCMDeGsqwztdwJRqTL20uS2cPe5H-svco'
const config = require('../../config/config.js');
const request = require('request')

//returning a book object for stoing in db
function retBookObj(book,apiBook){
	return {
		username:book.username,
		volume_id:book.volume_id,
		favourite:book.favourite,
		status:book.status,
		rating:book.rating,
		detail_obj:apiBook
	}
}
//for saving book
exports.storeBookShelf = (req,res) => {
	BookShelf.find({username:req.body.username,volume_id:req.body.volume_id},(err,book) => {
		if(err) return console.log(err)
		//no previous book found
		if(book.length == 0){
			let url = `https://www.googleapis.com/books/v1/volumes/${req.body.volume_id}?key=${config.booksApi.apiKey}`
			request(url, (err,resp,data) => {
				if (!err && resp.statusCode === 200){
					const book = JSON.parse(data)
					let newBookObj = retBookObj(req.body, book)
					let newBook = new BookShelf(newBookObj)
					newBook.save(err => {
						if(err) {
							console.log(err)
							return res.send('Error, Book cannot be added.')
						}
						res.send('Success, Book added to shelf.')
					})
				}
			})
		}else{
			return res.send('Error, Book already present in your shelf.')
		}
	})
}

//remove book
exports.removeBookShelf = (req,res) => {
	BookShelf.remove({username:req.body.username,volume_id:req.body.volume_id},(err) => {
		if (err){
			 console.log(err)
			 return res.send('Error, Book cannot be removed from shelf')
		}
		return res.send('Success, Book removed from shelf')
	})
}

//render random books
exports.bookShelfPage = (req,res) => {
BookShelf.find({username:req.params.user},(err,books) => {
	if(err) return console.log(err)
	res.render('bookshelf',{books:books})
})
}
