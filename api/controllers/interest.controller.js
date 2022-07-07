const Interest = require("../../models/interest.model");
const { validationResult } = require("express-validator");

module.exports.create = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Interest.create({
      term: req.body.term,
      usd: 0,
      vnd: req.body.vnd,
      createdAt: Date.now(),
    })
      .then(() => {
        return res.status(200).json("Thêm mới thành công.");
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
};

module.exports.list = async (req, res, next) => {
  await Interest.find()
    .where({ softDelete: "" })
    .sort({ term: 1 })
    .limit(10)
    .exec((err, interests) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(interests.map(formatInterest));
    });
};

function formatInterest(interestDB) {
  const { _id: id, term, usd, vnd, status } = interestDB;

  return {
    id,
    term,
    usd,
    vnd,
    status,
  };
}

module.exports.update = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Interest.updateOne(
      { _id: req.params.id },
      {
        term: req.body.term,
        usd: req.body.usd,
        vnd: req.body.vnd,
        status: req.body.status,
        updatedAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json("Cập nhật thành công.");
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
};
