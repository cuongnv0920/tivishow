const express = require("express");
const router = express.Router();
const validator = require("../../validator/interest.validator");

const controller = require("../controllers/interest.controller");

router.post("/create", validator.validatorCreateInterest(), controller.create);

router.get("/list/:page", controller.list);

router.get("/adminList", controller.adminList);

router.put(
  "/update/:id",
  validator.validatorUpdateInterest(),
  controller.update
);

router.put("/updateValid", controller.updateValid);

module.exports = router;
