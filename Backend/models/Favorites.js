const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trailer",
    required: true,
  },
  favorite_status: { type: Boolean, default: false },
});

module.exports = mongoose.model("Favorites", favoriteSchema);
