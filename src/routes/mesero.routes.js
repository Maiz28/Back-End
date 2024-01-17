const { Router } = require('express')
const router = Router ()

const meseroctrl = require('../controllers/mesero.controllers')

router.get('/', meseroctrl.getMesero)

module.exports = router