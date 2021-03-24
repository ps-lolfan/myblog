const { model, Schema } = require("mongoose");

const songSchema = new Schema({
  artist: String,
  title: String,
  img_src: String,
  src: String,
});

module.exports = model("Songs", songSchema);
