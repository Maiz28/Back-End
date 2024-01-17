const { Router } = require('express')
const router = Router ()

const comandactrl = require('../controllers/comanda.controllers.js')

router.get('/', comandactrl.getComandas)

router.post('/', comandactrl.createComanda)

router.get('/:idcomanda', comandactrl.getComanda)

router.put('/:idcomanda', comandactrl.editComanda)

router.delete('/:idcomanda', comandactrl.deleteComanda)

module.exports = router