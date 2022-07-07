const express = require("express");
const router = express.Router();

const controller = require("../controllers/valid.controller");

router.post("/create", controller.create);

router.get("/list", controller.list);

module.exports = router;
