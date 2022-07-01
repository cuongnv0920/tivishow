const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const amplitudeSchema = new Schema({
  image: {
    type: String,
    default: "",
  },

  currency: {
    type: String,
  },

  buyCash: {
    type: Number,
    default: 0,
  },

  buyTransfer: {
    type: Number,
    default: 0,
  },

  selling: {
    type: Number,
    default: 0,
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

amplitudeSchema.index({ "$**": "text" });
const Amplitude = mongoose.model("Amplitude", amplitudeSchema, "amplitude");

const doc = new Amplitude();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Amplitude;
