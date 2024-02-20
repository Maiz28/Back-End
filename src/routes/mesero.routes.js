const { Router } = require('express')
const router = Router ()

const meseroCtrl = require('../controllers/mesero.controllers')

router.get('/', meseroCtrl.getMesero)

router.post('/', meseroCtrl.createMesero)

router.put('/:id', meseroCtrl.editMesero)

router.delete('/:id', meseroCtrl.deleteMesero)

module.exports = router