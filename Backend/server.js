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

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de almacenamiento de Cloudinary con multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Carpeta en Cloudinary para almacenar avatares
    format: async (req, file) => "jpg", // El formato de la imagen
    public_id: (req, file) => file.originalname.split(".")[0], // Nombre del archivo en Cloudinary
  },
});

// Configurar multer para manejar la carga de imágenes
const upload = multer({ storage });

// Ruta para subir imágenes a Cloudinary
app.post("/api/upload", upload.single("avatar"), (req, res) => {
  try {
    // Devuelve la URL de la imagen subida
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    res.status(500).json({ message: "Error al subir la imagen" });
  }
});

// Importar rutas
const seedRoutes = require("./routes/seed");
app.use("/api/seed", seedRoutes);

const userRoutes = require("./routes/userRoutes");
const trailerRoutes = require("./routes/trailerRoutes");
const likeDislikeRoutes = require("./routes/likeDislikeRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

app.use("/api/users", userRoutes);
app.use("/api/trailers", trailerRoutes);
app.use("/api/trailers", likeDislikeRoutes);
app.use("/api/trailers", watchlistRoutes);

const authRoutes = require("./routes/auth"); // Importar las rutas de autenticación
app.use("/api/auth", authRoutes); // Asegúrate de usar el middleware de autenticación si es necesario

// Definir el puerto desde las variables de entorno o usar 5001 por defecto
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
