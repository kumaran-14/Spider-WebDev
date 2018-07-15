const Favourites = require('../models/Favourites.js')
const request = require('request')
const config = require('../../config/config.js');

//returning a book object for stoing in db
function retBookObj(book,apiBook){
	return {
		username:book.username,
		volume_id:book.volume_id,
		detail_obj:apiBook
	}
}
//for saving book
exports.storefavourites = (req,res) => {
	Favourites.find({username:req.body.username,volume_id:req.body.volume_id},(err,book) => {
		if(err) return console.log(err)
		//no previous book found
		if(book.length == 0){
			let url = `https://www.googleapis.com/books/v1/volumes/${req.body.volume_id}?key=${config.booksApi.apiKey}`
			request(url, (err,resp,data) => {
				if (!err && resp.statusCode === 200){
					const book = JSON.parse(data)
					let newBookObj = retBookObj(req.body, book)
					let newBook = new Favourites(newBookObj)
					newBook.save(err => {
						if(err) {
							console.log(err)
							return res.send('Error, Book cannot be added to favourites.')
						}
						return res.send('Success, Book added to favourites.')
					})
				}
			})
		}else{
			return res.send('Error, Book already present in your favourites.')
		}
	})
}

//remove book
exports.removefavourites = (req,res) => {
	Favourites.remove({username:req.body.username,volume_id:req.body.volume_id},(err) => {
		if (err){
			 console.log(err)
			 return res.send('Error, Book cannot be removed from favourites')
		}
		return res.send('Success, Book removed from favourites')
	})
}

