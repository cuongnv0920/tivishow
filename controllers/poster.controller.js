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
  const { _id: id, description, image, status } = data;

  return {
    id,
    description,
    image,
    status,
  };
}

module.exports.create = async (req, res, next) => {
  function image() {
    if (req.file) {
      const img = req.file;
      return {
        path: img.path.split("\\").slice(1).join("/"),
        size: img.size,
        originalname: img.originalname,
        mimetype: img.mimetype,
      };
    } else {
      return;
    }
  }

  if (image()?.size > 8 * 1024 * 1024) {
    fs.unlinkSync("./public/" + image());
    return res.status(400).json({ message: "File không được vượt quá 8MB." });
  }

  if (image()?.mimetype !== "image/png" && image()?.mimetype !== "image/jpeg") {
    fs.unlinkSync("./public/" + image());
    return res.status(400).json({ message: "File không đúng định dạng." });
  }

  await Poster.create({
    image: image()?.path,
    description: req.body.description,
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
  function image() {
    if (req.file) {
      const img = req.file;
      return {
        path: img.path.split("\\").slice(1).join("/"),
        size: img.size,
        originalname: img.originalname,
        mimetype: img.mimetype,
      };
    }
  }

  await Poster.updateOne(
    { _id: req.body.id },
    {
      image: image()?.path,
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
