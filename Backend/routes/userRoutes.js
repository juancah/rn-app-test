const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trailer = require("../models/Trailer");
const mongoose = require("mongoose");

// Ruta para marcar como visto
router.post("/:id/watched", async (req, res) => {
  console.log(`Ruta POST /${req.params.id}/watched llamada`);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de tráiler no válido" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) {
      return res.status(404).json({ message: "Tráiler no encontrado" });
    }

    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isWatched = user.watched.includes(trailer._id);

    if (isWatched) {
      user.watched = user.watched.filter(
        (id) => id.toString() !== trailer._id.toString()
      );
      console.log("Tráiler eliminado de la lista de vistos.");
    } else {
      user.watched.push(trailer._id);
      console.log("Tráiler agregado a la lista de vistos.");
    }

    await user.save();
    console.log("Estado de visto actualizado correctamente");

    return res.status(200).json({
      message: "Estado de visto actualizado",
      watched: user.watched,
    });
  } catch (error) {
    console.error("Error al actualizar el estado de visto:", error);
    return res.status(500).json({
      message: "Error al actualizar el estado de visto",
      error: error.message,
    });
  }
});

// Ruta para obtener el estado del video (watched, like, watchlist) para un usuario específico
router.post("/videoStatus", async (req, res) => {
  console.log("Ruta POST /videoStatus llamada");
  try {
    const { user_id, trailer_id } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isWatched = user.watched.includes(trailer_id);
    const isLiked = user.likes.includes(trailer_id);
    const isInWatchlist = user.watchlist.includes(trailer_id);

    res.json({
      watched: isWatched,
      liked: isLiked,
      inWatchlist: isInWatchlist,
    });
  } catch (error) {
    console.error("Error al obtener el estado del video:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el estado del video" });
  }
});

// Ruta para obtener el estado de watched para el usuario
router.post("/watchedStatus", async (req, res) => {
  console.log("Ruta POST /watchedStatus llamada");
  try {
    const { user_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user.watched);
  } catch (error) {
    console.error("Error al obtener el estado de visto:", error);
    return res.status(500).json({
      message: "Error al obtener el estado de visto",
      error: error.message,
    });
  }
});

module.exports = router;
