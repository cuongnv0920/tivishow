const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, "Vui lòng nhập địa chỉ email."],
    validate: {
      validator: function (email) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
      },
      message: (props) => `${props.value} Địa chỉ Email không hợp lệ.`,
    },
  },

  username: {
    type: String,
    require: [true, "Vui lòng nhập tên người dùng."],
  },

  password: {
    type: String,
    require: [true, "Vui lòng nhập mật khẩu."],
  },

  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    require: [true, "Vui lòng chọn Phòng/ Ban quản lý."],
  },

  status: {
    type: String,
    default: "enabled",
  },

  role: {
    type: String,
    default: "user",
  },

  image: {
    type: String,
  },
  softDelete: {
    type: Date,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

userSchema.index({ "$**": "text" });
const User = mongoose.model("User", userSchema, "users");

const doc = new User();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = User;
