const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model("Counter", counterSchema);
