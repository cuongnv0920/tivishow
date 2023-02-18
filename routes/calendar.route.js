const express = require("express");
const router = express.Router();

const controller = require("../controllers/calendar.controller");

router.get("/getAll", controller.getAll);

module.exports = router;
