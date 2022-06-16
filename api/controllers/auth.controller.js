const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const secretOrKey = require("../key/user.key");

module.exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = md5(password);

  const user = await User.findOne({ username: username });
  if (!user || user.softDelete == "") {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại!" });
  }

  if (user.password !== hashedPassword) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại!" });
  }

  const token = jwt.sign({ userId: user._id }, secretOrKey.key);
  return res.status(200).json({
    user: user,
    jwt: token,
  });
};
