const { Router } = require('express')
const router = Router ()

const pedidoCtrl = require ('../controllers/pedido.controllers.js')

router.get('/', pedidoCtrl.getPedido)

router.post('/', pedidoCtrl.createPedido)

router.put('/:id', pedidoCtrl.editPedido)

router.delete('/:id', pedidoCtrl.deletePedido)




module.exports = router