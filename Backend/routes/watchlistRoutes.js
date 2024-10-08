const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trailer = require("../models/Trailer");

// Ruta para agregar o quitar de la lista de pendientes (watchlist)
router.post("/:id/watchlist", async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) {
      return res.status(404).json({ message: "Tráiler no encontrado" });
    }

    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.watchlist.includes(trailer._id)) {
      user.watchlist.push(trailer._id);
    } else {
      user.watchlist = user.watchlist.filter(
        (id) => id.toString() !== trailer._id.toString()
      );
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Watchlist actualizada", watchlist: user.watchlist });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar la watchlist",
        error: error.message,
      });
  }
});

module.exports = router;
