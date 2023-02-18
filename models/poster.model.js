const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const posterSchema = new Schema({
  image: {
    type: String,
  },

  description: {
    type: String,
  },

  status: {
    type: Boolean,
    default: true,
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

posterSchema.index({ "$**": "text" });
const Posters = mongoose.model("Posters", posterSchema, "posters");

const doc = new Posters();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Posters;
