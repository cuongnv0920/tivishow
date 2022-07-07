const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sourceSchema = new Schema({
  video: {
    type: String,
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    default: "enabled",
  },

  type: {
    type: String,
  },

  softDelete: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

sourceSchema.index({ "$**": "text" });
const Sources = mongoose.model("Sources", sourceSchema, "sources");

const doc = new Sources();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Sources;
