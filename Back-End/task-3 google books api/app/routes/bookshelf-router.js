const router = require('express').Router();
const bookshelf = require('../controllers/bookshelf-controller.js');


//for adding book to bookShelf
router.post('/:user/add',bookshelf.storeBookShelf)

// for removing book from shelf
router.post('/:user/remove',bookshelf.removeBookShelf)

//for rendering bookShelf Page
router.get('/:user',bookshelf.bookShelfPage)



module.exports = router