const express = require("express");
const router = express.Router();
const Trailer = require("../models/Trailer");

// Ruta para obtener todos los tráileres
router.get("/", async (req, res) => {
  console.log("Ruta GET / llamada para obtener todos los tráileres");
  try {
    const trailers = await Trailer.find();
    console.log("Tráileres obtenidos:", trailers);
    res.json(trailers);
  } catch (error) {
    console.error("Error al obtener los tráileres:", error);
    res.status(500).json({ message: "Error al obtener los tráileres" });
  }
});

// Ruta para crear un nuevo tráiler
router.post("/add", async (req, res) => {
  console.log("Ruta POST /add llamada para crear un nuevo tráiler");
  try {
    const {
      name,
      year,
      pg,
      duration,
      cover_URL,
      video_URL,
      tags,
      description,
      likes_count,
      dislikes_count,
    } = req.body;

    const newTrailer = new Trailer({
      name,
      year,
      pg,
      duration,
      cover_URL,
      video_URL,
      tags,
      description,
      likes_count,
      dislikes_count,
    });

    await newTrailer.save();
    res
      .status(201)
      .json({ message: "Tráiler guardado correctamente", trailer: newTrailer });
  } catch (error) {
    console.error("Error al guardar el tráiler:", error);
    res.status(500).json({ message: "Error al guardar el tráiler" });
  }
});

module.exports = router;
