const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  description: String,
  price: Number,
});

module.exports = mongoose.model("Image", ImageSchema);