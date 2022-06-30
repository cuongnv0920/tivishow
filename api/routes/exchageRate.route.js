const express = require("express");
const router = express.Router();
const upload = require("../../config/storage.conf");

const controller = require("../controllers/exchangeRate.controller");

router.post("/create", upload.single("image"), controller.create);

module.exports = router;
