const { Router } = require('express')
const router = Router ()

const bebidactrl = require('../controllers/bebida.controllers')

router.get('/', bebidactrl.getBebida)

module.exports = router