const { Router } = require('express')
const router = Router ()

const usuarioCtrl = require('../controllers/usuarios.controllers.js')

router.get('/', usuarioCtrl.getUsuario)

router.post('/', usuarioCtrl.createUsuario)




module.exports = router