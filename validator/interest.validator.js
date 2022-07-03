const { check } = require("express-validator");
const Interest = require("../models/interest.model");

const validatorCreate = () => {
  return [
    check("term")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Kỳ hạn.")
      .custom((value) => {
        return Interest.exists({ term: value }).then((interest) => {
          if (interest) {
            return Promise.reject(
              "Kỳ hạn" +
                " " +
                value +
                " " +
                "đã tồn tại, vui lòng nhập Kỳ hạn khác"
            );
          }
        });
      }),

    check("vnd").not().isEmpty().withMessage("Vui lòng nhập Lãi suất VND."),
  ];
};

const validatorUpdate = () => {
  return [
    check("term")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Kỳ hạn.")
      .custom((value, { req }) => {
        return Interest.findOne({
          _id: { $ne: req.params.id },
          term: { $eq: value },
        }).then((interest) => {
          if (interest) {
            return Promise.reject(
              "Kỳ hạn" +
                " " +
                value +
                " " +
                "đã tồn tại, vui lòng nhập Kỳ hạn khác."
            );
          }
        });
      }),

    check("vnd").not().isEmpty().withMessage("Vui lòng nhập Lãi suất VND."),
  ];
};

const validator = {
  validatorCreateInterest: validatorCreate,
  validatorUpdateInterest: validatorUpdate,
};

module.exports = validator;
