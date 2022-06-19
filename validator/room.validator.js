const { check } = require("express-validator");
const Room = require("../models/room.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tên Phòng/ Ban.")
      .custom((value) => {
        return Room.exists({ name: value }).then((room) => {
          if (room) {
            return Promise.reject(
              "Tên Phòng/ Ban đã tồn tại, vui lòng kiểm tra lại."
            );
          }
        });
      }),

    check("code")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập mã Phòng/ Ban.")
      .custom((value) => {
        return Room.exists({ code: value }).then((room) => {
          if (room) {
            return Promise.reject(
              "Mã Phòng/ Ban đã tồn tại, vui lòng kiểm tra lại."
            );
          }
        });
      }),
  ];
};

const validator = {
  validatorCreateRoom: validatorCreate,
};

module.exports = validator;
