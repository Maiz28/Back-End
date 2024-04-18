 const {Router} = require('express')
 const bcrypt = require('bcryptjs')
 const router = Router ()

 const User = require('../../src/controllers/user.controllers')

//POST 
router.post('/register', (req, res)=>{

    req.body.password = bcrypt.hashSync(req.body.password, 10); 
   const user =    User.create(req.body); 
   res.json(user); 
}); 

module.exports = router 