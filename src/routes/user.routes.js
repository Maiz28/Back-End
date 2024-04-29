const { Router } = require("express");
const router = Router();
const userCtrl = require("../../src/controllers/user.controllers");

//POST
router.post("/register", userCtrl.createUser);
router.post("/login", userCtrl.loginUser);

//restablecer contra
router.put("/reset-password", userCtrl.resetPassword);
router.post("/request-password-reset", userCtrl.requestPasswordReset);

module.exports = router;
