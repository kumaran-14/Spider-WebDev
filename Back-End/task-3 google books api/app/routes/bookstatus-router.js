const router = require('express').Router();
const bookstatus = require('../controllers/bookstatus-controller.js');


//for adding book to bookShelf
router.post('/:user/modify',bookstatus.storeBookStatus)

module.exports = router