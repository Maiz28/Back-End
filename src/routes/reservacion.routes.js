const { Router } = require("express");
const router = Router();

const reservacionesCtrl = require("../controllers/reservacion.controllers.js");

router.get("/", reservacionesCtrl.getReservaciones);

router.post("/", reservacionesCtrl.createReservacion);

router.get("/:id", reservacionesCtrl.getReservacion);

router.put("/:id", reservacionesCtrl.editReservacion);

router.delete("/:id", reservacionesCtrl.deleteReservacion);

module.exports = router;
