const User = require("../../models/user.model");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../key/user.key");
const { validationResult } = require("express-validator");

const now = new Date();

module.exports.register = async (req, res, next) => {
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
    const email = req.body.email;
    const username = email.substring(0, email.indexOf("@"));

    const token = jwt.sign({ user: "newUser" }, secretOrKey.key);

    await User.create({
      email: email,
      username: username,
      password: md5(req.body.password),
      status: "enabled",
      image: "",
      role: "user",
      createdAt: Date.now(),
      updatedAt: "",
      softDelete: "",
    })
      .then((user) => {
        return res.status(200).json({
          jwt: token,
          user: user,
        });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.list = async (req, res, next) => {
  await User.find()
    .where({ softDelete: "" })
    .populate("room")
    .sort({ createdAt: 1 })
    .exec((err, users) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(users.map(formatUser));
    });
};

function formatUser(userFormBD) {
  const { _id: id, username, email, room, status, role } = userFormBD;

  return {
    id,
    username,
    email,
    room: room?.name || "",
    status,
    role,
  };
}

module.exports.update = async (req, res, next) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      status: req.body.status,
      role: req.body.role,
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công!" });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
