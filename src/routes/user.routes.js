 const {Router} = require('express')
 const bcrypt = require('bcryptjs')
 const router = Router ()

 const User = require('../../src/controllers/user.controllers')
const userCtrl = require('../../src/controllers/user.controllers')

//POST 
router.post('/register', userCtrl.createUser)
router.post('/login', userCtrl.loginUser)

module.exports = router 