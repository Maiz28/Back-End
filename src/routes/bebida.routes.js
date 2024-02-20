const { Router } = require('express')
const router = Router ()

const bebidaCtrl= require('../controllers/bebida.controllers.js')

router.get('/', bebidaCtrl.getBebida)
router.post('/', bebidaCtrl.createBebida)
router.put('/:id', bebidaCtrl.editBebida)
router.delete('/:id', bebidaCtrl.deleteBebida)


module.exports = router;