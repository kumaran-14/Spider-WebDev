const BookStatus = require('../models/BookStatus.js')
const request = require('request')
const config = require('../../config/config.js');


//returning a book object for stoing in db
function retBookObj(book,apiBook){
	return {
		username:book.username,
		volume_id:book.volume_id,
		status:book.status,
		detail_obj:apiBook
	}
}
//for saving bookStatus
exports.storeBookStatus = (req,res) => {
	if(req.body.status == 0) {
		return res.send('Error, Please set a valid status.')
	}
	BookStatus.find({username:req.body.username,volume_id:req.body.volume_id},(err,book) => {
		if(err) return console.log(err)
		//no previous book found
		if(book.length == 0){
			let url = `https://www.googleapis.com/books/v1/volumes/${req.body.volume_id}?key=${config.booksApi.apiKey}`
			request(url, (err,resp,data) => {
				if (!err && resp.statusCode === 200){
					const book = JSON.parse(data)
					let newBookObj = retBookObj(req.body, book)
					let newBook = new BookStatus(newBookObj)
					newBook.save(err => {
						if(err) {
							console.log(err)
							return res.send('Error, Book status not updated.')
						}
						res.send('Success, Book status set.')
					})
				}
			})
		}else{
			BookStatus.update({username:req.body.username,volume_id:req.body.volume_id},{$set:{status:req.body.status}},(err,book) => {
				return res.send('Success, Book staus modified.')
			})
		}
	})
}
