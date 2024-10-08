const express = require("express");
const User = require("../models/User");
const Trailer = require("../models/Trailer");
const Like = require("../models/likeDislikes");

const router = express.Router();

router.post("/populate", async (req, res) => {
  try {
    // Crear un nuevo tráiler
    const newTrailer = new Trailer({
      name: "Inception 2",
      year: 2010,
      pg: "PG-13",
      duration: "2h 28min",
      cover_URL: "http://imageurl.com/inception.jpg",
      video_URL: "http://videourl.com/inception.mp4",
      tags: ["Sci-Fi", "Action"],
      description: "A skilled thief is given a chance at redemption...",
    });

    await newTrailer.save();

    // Crear un nuevo usuario
    const newUser = new User({
      name: "John Doe 25",
      email: "johndoe@examplessss.com",
      user_name: "johndoe12345",
      terms: true,
    });

    await newUser.save();

    // Agregar un "Like"
    const newLike = new Like({
      user: newUser._id,
      trailer: newTrailer._id,
      like_status: true,
    });

    await newLike.save();

    res
      .status(200)
      .json({ message: "Datos de ejemplo insertados correctamente" });
  } catch (err) {
    console.error("Error al insertar los datos:", err);
    res.status(500).json({ message: "Error al insertar los datos" });
  }
});

module.exports = router;
