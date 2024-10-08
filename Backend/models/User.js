const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String, default: null },
    google_id: { type: String, default: null, unique: true }, // Para Google Sign-In
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trailer" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trailer" }],
    watched: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trailer" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trailer" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
