const mongoose = require("mongoose");

const trailerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number },
  pg: { type: String },
  duration: { type: String },
  cover_URL: { type: String },
  video_URL: { type: String },
  tags: [String], // Array de etiquetas
  description: { type: String },
  likes_count: { type: Number },
  dislikes_count: { type: Number },
});

module.exports = mongoose.model("Trailer", trailerSchema);
