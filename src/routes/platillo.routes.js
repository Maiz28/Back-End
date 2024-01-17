const { Router } = require('express')
const router = Router ()

const platilloctrl = require('../controllers/platillo.controllers')

router.get('/', platilloctrl.getUltima)

module.exports = router