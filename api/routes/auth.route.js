const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/login", controller.login);

router.put("/update/:id", controller.update);

module.exports = router;
