const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trailer",
    required: true,
  },
  like_status: { type: Boolean, required: true },
});

module.exports = mongoose.model("Likes", likeSchema);
