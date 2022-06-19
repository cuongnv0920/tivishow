const express = require("express");
const validator = require("../../validator/room.validator");
const router = express.Router();

const controller = require("../controllers/room.controller");

router.post("/create", validator.validatorCreateRoom(), controller.create);

router.get("/list", controller.list);

router.put("/update/:id", validator.validatorUpdateRoom(), controller.update);

module.exports = router;
