const Poster = require("../../models/poster.model");
const fs = require("fs");

module.exports.create = async (req, res, next) => {
  function image() {
    if (req.file) {
      return req.file.path.split("\\").slice(1).join("/");
    } else {
      return "";
    }
  }

  if (image() === "" || image() === undefined) {
    return res.status(400).json({ message: "Vui lòng chọn file ảnh poster." });
  }

  if (req.file?.size > 8 * 1000 * 1000) {
    fs.unlinkSync("./public/" + image());
    return res
      .status(400)
      .join({ message: "File ảnh không được vượt quá 8MB." });
  }

  if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") {
    fs.unlinkSync("./public/" + image());
    return res.status(400).json({ message: "File ảnh không đúng định dạng." });
  }

  await Poster.create({
    image: image(),
    description: req.body.description,
    status: "enabled",
    createdAt: Date.now(),
  })
    .then(() => {
      return res.status(200).json({ message: "Upload file thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.list = async (req, res, next) => {
  await Poster.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, posters) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(posters.map(formatPoster));
    });
};

function formatPoster(posterFormBD) {
  const { _id: id, description, image, status } = posterFormBD;

  return {
    id,
    description,
    image,
    status,
  };
}

module.exports.update = async (req, res, next) => {
  function image() {
    if (req.file) {
      return req.file.path.split("\\").slice(1).join("/");
    }
  }

  const undefinedRe = (data) => {
    if (data !== "undefined") {
      return data;
    }
  };

  await Poster.updateOne(
    { _id: req.body.id },
    {
      image: image(),
      status: undefinedRe(req.body.status),
      description: undefinedRe(req.body.description),
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
