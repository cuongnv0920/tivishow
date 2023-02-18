const Video = require("../models/video.model");
const fs = require("fs");

module.exports.getAll = async (req, res, next) => {
  await Video.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((err, videos) => {
      Video.countDocuments((err, count) => {
        if (err) return res.status(400).json(err);

        return res.status(200).json({
          video: videos.map(formatVideo),
          count: count,
        });
      });
    });
};

function formatVideo(data) {
  const { _id: id, description, video, type, status } = data;

  return {
    id,
    description,
    video,
    type,
    status,
  };
}

module.exports.create = async (req, res, next) => {
  function video() {
    if (req.file) {
      const video = req.file;
      return {
        path: video.path.split("\\").slice(1).join("/"),
        size: video.size,
        originalname: video.originalname,
        mimetype: video.mimetype,
      };
    } else {
      return;
    }
  }

  if (video()?.size > 150 * 1024 * 1024) {
    fs.unlinkSync("./public/" + video());
    return res.status(400).json({ message: "File không được vượt quá 150MB." });
  }

  if (video()?.mimetype !== "video/mp4" && video()?.mimetype !== "video/ogg") {
    fs.unlinkSync("./public/" + video());
    return res.status(400).json({ message: "File không đúng định dạng." });
  }

  await Video.create({
    video: video(),
    description: req.body.description,
    type: req.file.mimetype,
    createdAt: Date.now(),
  })
    .then(() => {
      return res.status(200).json({ message: "Thêm video thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.update = async (req, res, next) => {
  function video() {
    if (req.file) {
      const video = req.file;
      return {
        path: video.path.split("\\").slice(1).join("/"),
        size: video.size,
        originalname: video.originalname,
        mimetype: video.mimetype,
      };
    }
  }

  const undefinedRe = (data) => {
    if (data !== "undefined") {
      return data;
    }
  };

  await Video.updateOne(
    { _id: req.body.id },
    {
      video: video()?.path,
      status: undefinedRe(req.body.status),
      description: undefinedRe(req.body.description),
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
