const { check } = require("express-validator");
const Amlitude = require("../models/amplitude.model");

const validatorCreate = () => {
  return [
    check("currency").not().isEmpty().withMessage("Vui lòng chọn mã ngoại tệ."),

    check("buyCash")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Biên độ Mua tiền mặt."),

    check("buyTransfer")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Biên độ Mua chuyển khoản."),

    check("selling").not().isEmpty().withMessage("Vui lòng nhập Biên độ Bán."),
  ];
};

const validatorUpdate = () => {
  return [
    check("currency").not().isEmpty().withMessage("Vui lòng chọn mã ngoại tệ."),

    check("buyCash")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Biên độ Mua tiền mặt."),

    check("buyTransfer")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Biên độ Mua chuyển khoản."),

    check("selling").not().isEmpty().withMessage("Vui lòng nhập Biên độ Bán."),
  ];
};

const validator = {
  validatorCreateAmplitude: validatorCreate,
  validatorUpdateAmplitude: validatorUpdate,
};

module.exports = validator;
