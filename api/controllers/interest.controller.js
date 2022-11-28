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
  const limit = 8;
  const page = req.params.page || 1;

  await Interest.find()
    .skip(limit * page - limit)
    .limit(limit)
    .where({ softDelete: "" })
    .sort({ createdAt: 1 })
    .exec((err, interests) => {
      Interest.countDocuments((err, count) => {
        if (err) return res.status(400).json(err);

        return res.status(200).json({
          interests: interests.map(formatInterest),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(count / limit),
          },
        });
      });
    });
};

function formatInterest(interestFormDB) {
  const { _id: id, term, usd, vnd, valid, status } = interestFormDB;

  return {
    id,
    term,
    usd,
    vnd,
    valid,
    status,
  };
}

module.exports.adminList = async (req, res, next) => {
  await Interest.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, interests) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(interests.map(formatInterestAdmin));
    });
};

function formatInterestAdmin(interestFromAdminDB) {
  const { _id: id, term, usd, vnd, valid, status } = interestFromAdminDB;

  return {
    id,
    term,
    usd,
    vnd,
    valid,
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

module.exports.updateValid = async (req, res, next) => {
  const exist = await Interest.find().where({ softDelete: "" });

  if (exist.length === 0) {
    return res
      .status(400)
      .json({ message: "Chưa có danh sách Lãi suất tiền gửi trong bảng." });
  } else {
    await Interest.updateMany({}, { valid: req.body.valid })
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
};
