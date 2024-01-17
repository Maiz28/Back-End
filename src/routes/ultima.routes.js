const { Router } = require('express')
const router = Router ()

const ultimactrl = require('../controllers/ultima.controllers')

router.get('/', ultimactrl.getUltima)

module.exports = router