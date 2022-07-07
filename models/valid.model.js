const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validSchema = new Schema({
  date: {
    type: Date,
    require: [true, "Vui lòng chọn ngày hiệu lực."],
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

validSchema.index({ "$**": "text" });
const Valid = mongoose.model("Valid", validSchema, "valid");

const doc = new Valid();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Valid;
