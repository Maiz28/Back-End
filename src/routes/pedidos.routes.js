const { Router } = require('express')
const router = Router ()

const pedidosctrl = require('../controllers/pedidos.controllers')

router.get('/', pedidosctrl.getPedidos)

router.post('/', pedidosctrl.createPedido)

router.get('/:idcomanda', pedidosctrl.getPedido)

router.put('/:idpedido', pedidosctrl.editPedido)

router.delete('/:idpedido', pedidosctrl.deletePedido)

module.exports = router