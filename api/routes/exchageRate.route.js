const express = require("express");
const router = express.Router();
const upload = require("../../config/storage.conf");

const controller = require("../controllers/exchangeRate.controller");

// router.post("/update", controller.update);

router.get("/list/:page", controller.list);

module.exports = router;
