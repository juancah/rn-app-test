const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trailer = require("../models/Trailer");
const Likes = require("../models/likeDislikes");

// Ruta para dar like
router.post("/:id/like", async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) {
      return res.status(404).json({ message: "Tráiler no encontrado" });
    }

    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let like = await Likes.findOne({ user: user._id, trailer: trailer._id });

    if (!like) {
      like = new Likes({
        user: user._id,
        trailer: trailer._id,
        like_status: true,
      });
      trailer.likes_count = (trailer.likes_count || 0) + 1;
    } else if (like.like_status === false) {
      trailer.dislikes_count -= 1;
      trailer.likes_count += 1;
      like.like_status = true;
    }

    await like.save();
    await trailer.save();
    res
      .status(200)
      .json({ message: "Like actualizado correctamente", trailer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al manejar el like", error: error.message });
  }
});

// Ruta para dar dislike
router.post("/:id/dislike", async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) {
      return res.status(404).json({ message: "Tráiler no encontrado" });
    }

    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let like = await Likes.findOne({ user: user._id, trailer: trailer._id });

    if (!like) {
      like = new Likes({
        user: user._id,
        trailer: trailer._id,
        like_status: false,
      });
      trailer.dislikes_count = (trailer.dislikes_count || 0) + 1;
    } else if (like.like_status === true) {
      trailer.likes_count -= 1;
      trailer.dislikes_count += 1;
      like.like_status = false;
    }

    await like.save();
    await trailer.save();
    res
      .status(200)
      .json({ message: "Dislike actualizado correctamente", trailer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al manejar el dislike", error: error.message });
  }
});

module.exports = router;
