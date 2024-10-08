const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cargar variables de entorno desde .env
dotenv.config();

// Crear la app de Express
const app = express();

// Servir archivos estáticos (como avatares) si decides usar el sistema local en el futuro
app.use("/uploads", express.static("uploads"));

// Aplicar CORS
app.use(cors()); // Esto permite todas las solicitudes desde cualquier origen

// Middleware para procesar JSON en las solicitudes
app.use(express.json()); // ¡Este middleware es importante para leer req.body!

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectarse a MongoDB:", err);
  });

const User = mongoose.model("User", new mongoose.Schema({}));

// Buscar el usuario por ID
User.findById("6702d06bd92e54ff67146708", (err, user) => {
  if (err) {
    console.error("Error al buscar el usuario:", err);
  } else {
    console.log("Usuario encontrado:", user);
  }
  mongoose.connection.close();
});
