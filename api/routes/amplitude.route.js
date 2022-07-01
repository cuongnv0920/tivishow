const express = require("express");
const router = express.Router();
const validator = require("../../validator/amplitude.validator");

const controller = require("../controllers/amplitude.controller");

router.post(
  "/create",
  validator.validatorCreateAmplitude(),
  controller.created
);

router.get("/list", controller.list);

router.put(
  "/update/:id",
  validator.validatorUpdateAmplitude(),
  controller.update
);

module.exports = router;
