const express = require("express");
const validator = require("../../validator/user.validator");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.post(
  "/register",
  validator.validatorRegisterUser(),
  controller.register
);

module.exports = router;
