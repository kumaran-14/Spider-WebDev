const express = require('express');
const router = express()

const users = require('../controllers/users-controller.js')

router.get('/login',users.login)
router.post('/login',users.signIn)
router.get('/register',users.register)
router.post('/register',users.addUser)
router.get('/logout',users.logout)

module.exports = router
