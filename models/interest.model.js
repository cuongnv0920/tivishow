const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interestSchema = new Schema({
  term: {
    type: String,
    require: [true, "Vui lòng nhập Kỳ hạn."],
  },

  usd: {
    type: Number,
    default: 0,
  },

  vnd: {
    type: Number,
    require: [true, "Vui lòng nhập lãi suất VND."],
  },

  status: {
    type: String,
    default: "enabled",
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

interestSchema.index({ "$**": "text" });
const Interest = mongoose.model("Interest", interestSchema, "interest");

const doc = new Interest();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Interest;
