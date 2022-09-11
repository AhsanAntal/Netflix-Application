const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  img: { type: String },
  imgTitle: { type: String },
  imgsm: { type: String },
  trailer: { type: String },
  genre: { type: String },
  video: { type: String },
  year: { type: String },
  duration: { type: String },
  limit: { type: Number },
  genre: { type: String },
  isTvShows: { type: Boolean, default: false },
});

module.exports = mongoose.model("Movie", MovieSchema);
