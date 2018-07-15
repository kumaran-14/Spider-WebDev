const router = require('express').Router();
const favourites = require('../controllers/favourites-controller.js');


//for adding book to favourites
router.post('/:user/add',favourites.storefavourites)

// for removing book from favourites
router.post('/:user/remove',favourites.removefavourites)


module.exports = router