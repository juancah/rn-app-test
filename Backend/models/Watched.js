const mongoose = require("mongoose");

const watchedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trailer",
    required: true,
  },
  watched_status: { type: Boolean, default: false },
});

module.exports = mongoose.model("Watched", watchedSchema);
