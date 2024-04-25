const { Router } = require("express");
const router = Router();
const userCtrl = require("../../src/controllers/user.controllers");

//POST
router.post("/register", userCtrl.createUser);
router.post("/login", userCtrl.loginUser);

module.exports = router;
