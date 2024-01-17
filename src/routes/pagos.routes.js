const { Router } = require('express')
const router = Router ()

const pagosctrl = require('../controllers/pago.controllers')

router.get('/', pagosctrl.getPagos)


module.exports = router