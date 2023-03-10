const Poster = require("../models/poster.model");
const fs = require("fs");

module.exports.getAll = async (req, res, next) => {
  await Poster.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, posters) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(posters.map(formatPoster));
    });
};

function formatPoster(data) {
  const { _id: id, description, path, status } = data;

  return {
    id,
    description,
    path,
    status,
  };
}

module.exports.create = async (req, res, next) => {
  function files() {
    if (req.file) {
      const file = req.file;
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        originalname: file.originalname,
        mimetype: file.mimetype,
      };
    } else {
      return;
    }
  }

  if (files()?.size > 8 * 1024 * 1024) {
    return res
      .status(400)
      .json({ message: "Tệp tin ảnh không được vượt quá 8MB." });
  }

  if (files()?.mimetype !== "image/png" && files()?.mimetype !== "image/jpeg") {
    return res
      .status(400)
      .json({ message: "Tệp tin ảnh không đúng định dạng." });
  }

  await Poster.create({
    path: files()?.path,
    description: req.body.description,
    type: files().mimetype,
    createdAt: Date.now(),
  })
    .then(() => {
      return res.status(200).json({ message: "Thêm poster thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.update = async (req, res, next) => {
  function files() {
    if (req.file) {
      const file = req.file;
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        originalname: file.originalname,
        mimetype: file.mimetype,
      };
    }
  }

  await Poster.updateOne(
    { _id: req.params.id },
    {
      image: files()?.path,
      status: req.body.status,
      description: req.body.description,
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

module.exports.delete = async (req, res, next) => {
  await Poster.updateOne(
    {
      _id: req.params.id,
    },
    {
      softDelete: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Xóa thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};
