const Source = require("../../models/source.model");
const fs = require("fs");

module.exports.create = async (req, res, next) => {
  function source() {
    if (req.file) {
      return req.file.path.split("\\").slice(1).join("/");
    } else {
      return "";
    }
  }

  if (source() === "" || source() === undefined) {
    return res.status(400).json({ message: "Vui lòng chọn file video." });
  }

  if (req.file?.size > 150 * 1024 * 1024) {
    fs.unlinkSync("./public/" + source());
    return res
      .status(400)
      .json({ message: "File video không được vượt quá 150MB." });
  }

  if (req.file.mimetype !== "video/mp4" && req.file.mimetype !== "video/ogg") {
    fs.unlinkSync("./public/" + source());
    return res
      .status(400)
      .json({ message: "File video không đúng định dạng." });
  }

  await Source.create({
    video: source(),
    description: req.body.description,
    type: req.file.mimetype,
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
  await Source.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, sources) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(sources.map(formatSource));
    });
};

function formatSource(sourceFormBD) {
  const { _id: id, description, video, type, status } = sourceFormBD;

  return {
    id,
    description,
    video,
    type,
    status,
  };
}

module.exports.update = async (req, res, next) => {
  function source() {
    if (req.file) {
      return req.file.path.split("\\").slice(1).join("/");
    }
  }

  const undefinedRe = (data) => {
    if (data !== "undefined") {
      return data;
    }
  };

  await Source.updateOne(
    { _id: req.body.id },
    {
      video: source(),
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
