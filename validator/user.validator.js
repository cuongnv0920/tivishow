const { check } = require("express-validator");
const User = require("../models/user.model");

const validatorRegister = () => {
  return [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Vùi lòng nhập địa chỉ email.")
      .custom((value) => {
        return User.exists({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "Địa chỉ email đã tồn tại, vui lòng nhập địa chỉ email khác."
            );
          }
        });
      }),

    check("password")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập mật khẩu.")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),

    check("retypePassword")
      .not()
      .isEmpty()
      .withMessage("Vùi lòng xác nhận lại mật khẩu.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Mật khẩu xác nhận không đúng.");
        }
        return true;
      }),
  ];
};

const validator = {
  validatorRegisterUser: validatorRegister,
};

module.exports = validator;
