const Valid = require("../../models/valid.model");

module.exports.create = async (req, res, next) => {
  if (req.body.valid === undefined || req.body.valid === "") {
    return res.status(400).json({ message: "Vui lòng chọn Ngày hiệu lực." });
  }

  await Valid.create({
    date: req.body.valid,
    createdAt: Date.now(),
  })
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

module.exports.list = async (req, res, next) => {
  await Valid.find()
    .where({ softDelete: "" })
    .limit(1)
    .sort({ createdAt: -1 })
    .exec((err, valids) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(valids.map(formatValid));
    });
};

function formatValid(validFormDB) {
  const { _id: id, date } = validFormDB;

  return {
    id,
    date,
  };
}
