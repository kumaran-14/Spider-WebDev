const router = require('express').Router();
const search = require('../controllers/search-controller.js');


//for navbar search
router.post('/:user',search.navSearch)

//for rendering search Page
router.get('/:user',search.searchPage)



module.exports = router