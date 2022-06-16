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
    return res.status(400).json({ message: errors });
  } else {
    const email = req.body.email;
    const username = email.substring(0, email.indexOf("@"));

    const token = jwt.sign({ user: "newUser" }, secretOrKey.key);

    await User.create({
      email: email,
      username: username,
      password: md5(req.body.password),
      status: 1,
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
