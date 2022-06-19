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

const validatorUpdate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tên Phòng/ Ban.")
      .custom((value, { req }) => {
        return Room.findOne({
          _id: { $ne: req.params.id },
          name: { $eq: value },
        }).then((room) => {
          if (room) {
            return Promise.reject(
              "Tên Phòng/ Ban đã tồn tại, vui lòng nhập Tên Phòng/ Ban khác."
            );
          }
        });
      }),

    check("code")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập mã Phòng/ Ban.")
      .custom((value, { req }) => {
        return Room.findOne({
          _id: { $ne: req.params.id },
          code: { $eq: value },
        }).then((room) => {
          if (room) {
            return Promise.reject(
              "Mã Phòng/ Ban đã tồn tại, vui lòng nhập Mã Phòng/ Ban khác."
            );
          }
        });
      }),
  ];
};

const validator = {
  validatorCreateRoom: validatorCreate,
  validatorUpdateRoom: validatorUpdate,
};

module.exports = validator;
