const { Router } = require('express')
const router = Router ()

const completoctrl = require('../controllers/completo.controllers')

router.get('/', completoctrl.getCompleto)

module.exports = router