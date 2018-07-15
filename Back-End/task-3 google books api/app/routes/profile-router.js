const router = require('express').Router();
const profile = require('../controllers/profile-controller.js');

//for rendering bookShelf Page
router.get('/:user',profile.displayProfilePage)

//for rendering bookShelf Page
router.post('/activity/:user/add',profile.storeActivity)
module.exports = router