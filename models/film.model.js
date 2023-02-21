const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filmSchema = new Schema({
  path: {
    type: String,
  },

  description: {
    type: String,
  },

  status: {
    type: Boolean,
    default: true,
  },

  type: {
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

filmSchema.index({ "$**": "text" });
const Films = mongoose.model("Films", filmSchema, "films");

const doc = new Films();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Films;
