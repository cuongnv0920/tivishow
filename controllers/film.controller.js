const Film = require("../models/film.model");
const fs = require("fs");

module.exports.getAll = async (req, res, next) => {
  const limit = req.query._limit;
  const page = req.query._page;

  await Film.find()
    .where({ softDelete: null })
    .skip(limit * page - limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec((err, films) => {
      Film.countDocuments((error, total) => {
        if (err) return res.status(400).json(error);

        return res.status(200).json({
          films: films.map(formatFilm),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(total / limit),
          },
        });
      });
    });
};

function formatFilm(data) {
  const { _id: id, description, path, type, status } = data;

  return {
    id,
    description,
    path,
    type,
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

  if (files()?.size > 150 * 1024 * 1024) {
    return res
      .status(400)
      .json({ message: "Tệp tin video không được vượt quá 150MB." });
  }

  if (files()?.mimetype !== "video/mp4" && files()?.mimetype !== "video/ogg") {
    return res
      .status(400)
      .json({ message: "Tệp tin video không đúng định dạng." });
  }

  await Film.create({
    path: files().path,
    description: req.body.description,
    type: files().mimetype,
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

  await Film.updateOne(
    { _id: req.params.id },
    {
      path: files()?.path,
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
  await Film.updateOne(
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
