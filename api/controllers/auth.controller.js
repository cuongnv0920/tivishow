const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const secretOrKey = require("../key/user.key");

module.exports.login = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.username;
  const password = md5(req.body.password);

  const user = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại!" });
  }

  if (user[0].password !== password) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại!" });
  }

  if (user[0].status === "disabled") {
    return res.status(400).json({
      message: "User đang bị tạm khóa, vui lòng liên hệ quản trị!",
    });
  }

  const token = jwt.sign({ userId: user._id }, secretOrKey.key);
  return res.status(200).json({
    user: user[0],
    jwt: token,
  });
};

module.exports.update = async (req, res, next) => {
  function hashPassword() {
    if (req.body.password) {
      return md5(req.body.password);
    }
  }
  const user = await User.findById(req.params.id);
  const token = jwt.sign({ userId: user._id }, secretOrKey.key);

  if (user.password !== md5(req.body.oldPassword)) {
    return res
      .status(400)
      .json({ message: "Mật khẩu cũ không đúng, vui lòng kiểm tra lại." });
  } else {
    await User.updateOne(
      { _id: req.params.id },
      {
        password: hashPassword(),
        updatedAt: Date.now(),
      }
    )
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
