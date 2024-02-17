const { Router } = require('express')
const router = Router ()

const usuariosctrl = require('../controllers/usuarios.controllers.js')

router.get('/', usuariosctrl.getusuarios)

module.exports = router