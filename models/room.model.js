const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    require: [true, "Vui lòng nhập tên Phòng/ Ban."],
  },
  code: {
    type: String,
    require: [true, "Vui lòng nhập mã Phòng/ Ban."],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  softDelete: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

roomSchema.index({ "$**": "text" });
const Room = mongoose.model("Room", roomSchema, "room");

const doc = new Room();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Room;
