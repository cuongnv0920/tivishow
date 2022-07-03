const express = require("express");
const router = express.Router();
const validator = require("../../validator/interest.validator");

const controller = require("../controllers/interest.controller");

router.post("/create", validator.validatorCreateInterest(), controller.created);

router.get("/list", controller.list);

router.put(
  "/update/:id",
  validator.validatorUpdateInterest(),
  controller.update
);

module.exports = router;
