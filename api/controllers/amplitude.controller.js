const Amlitude = require("../../models/amplitude.model");
const ExchangeRate = require("../../models/exchangeRate.model");
const { validationResult } = require("express-validator");

module.exports.created = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  const ensign = (name) => {
    return "images/" + name.slice(0, 3) + ".png";
  };

  if (errors.length) {
    return res.status(400).json({ message: errors });
  } else {
    await Amlitude.create({
      image: ensign(req.body.currency),
      currency: req.body.currency,
      buyCash: req.body.buyCash,
      buyTransfer: req.body.buyTransfer,
      selling: req.body.selling,
      createdAt: Date.now(),
    })
      .then((amplitude) => {
        return res.status(200).json({ amplitude: amplitude });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });

    await ExchangeRate.create({
      image: ensign(req.body.currency),
      currency: req.body.currency,
      buyCash: 0,
      buyTransfer: 0,
      selling: 0,
      createdAt: Date.now(),
    });
  }
};

module.exports.list = async (req, res, next) => {
  await Amlitude.find()
    .where({ softDelete: "" })
    .sort({ createdAt: 1 })
    .exec((err, amplitudes) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(amplitudes.map(formatDB));
    });
};

function formatDB(amplitudeFormDB) {
  const {
    _id: id,
    image,
    currency,
    buyCash,
    buyTransfer,
    selling,
  } = amplitudeFormDB;

  return {
    id,
    image,
    currency,
    buyCash,
    buyTransfer,
    selling,
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
    return res.status(400).json({ message: errors });
  } else {
    await Amlitude.updateOne(
      { _id: req.params.id },
      {
        currency: req.body.currency,
        buyCash: req.body.buyCash,
        buyTransfer: req.body.buyTransfer,
        selling: req.body.selling,
        updatedAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
      })
      .catch((err) => {
        return res.status(400).json({ message: err });
      });
  }
};
