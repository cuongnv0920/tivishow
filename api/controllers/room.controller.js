const Room = require("../../models/room.model");
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
    await Room.create({
      name: req.body.name,
      code: req.body.code,
      createdAt: Date.now(),
      updatedAt: "",
      softDelete: "",
    })
      .then((room) => {
        return res.status(200).json({ room: room });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.list = async (req, res, next) => {
  await Room.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, rooms) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(rooms.map(formatDB));
    });
};

function formatDB(roomFormDB) {
  const { _id: id, code, name } = roomFormDB;

  return {
    id,
    code,
    name,
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
    await Room.updateOne(
      { _id: req.params.id },
      {
        code: req.body.code,
        name: req.body.name,
        updatedAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công!" });
      })
      .catch((err) => {
        return res.status(400).json({ message: err });
      });
  }
};
