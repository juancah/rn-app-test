const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config(); // Asegúrate de tener las variables de entorno

const router = express.Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar almacenamiento en Cloudinary con multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Carpeta en Cloudinary donde se guardarán las imágenes
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Opcional: para limitar el tamaño
  },
});

const upload = multer({ storage: storage });

// Ruta para registrar usuarios
router.post(
  "/register",
  upload.single("avatar"), // Middleware de multer para subir un avatar a Cloudinary
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("user_name", "El nombre de usuario es obligatorio").not().isEmpty(),
    check("email", "Por favor ingrese un email válido").isEmail(),
    check(
      "password",
      "La contraseña debe tener al menos 6 caracteres"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, user_name, email, password } = req.body;
    let avatar = null;

    if (req.file) {
      avatar = req.file.path; // La URL de Cloudinary se encuentra en req.file.path
    }

    try {
      // Verificar si el usuario ya existe
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Crear nuevo usuario
      user = new User({
        name,
        user_name,
        email,
        password,
        profile_image: avatar, // Guardar la URL de Cloudinary en el campo profile_image
      });

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Guardar el usuario en la base de datos
      await user.save();

      // Generar el token JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || "secretTokenKey", // Cambia por una clave secreta más segura en producción
        { expiresIn: "1h" }, // El token expira en 1 hora
        (err, token) => {
          if (err) throw err;
          res.json({ token, user_id: user._id }); // Devuelve el token y el user_id
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error en el servidor");
    }
  }
);

// Ruta para autenticar usuarios (login)
router.post(
  "/login",
  [
    check("email", "Por favor ingrese un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Verificar si el usuario existe
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "El usuario no existe" });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Credenciales incorrectas" });
      }

      // Generar el token JWT si la autenticación es exitosa
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || "secretTokenKey", // Clave secreta para firmar el token
        { expiresIn: "1h" }, // Expira en 1 hora
        (err, token) => {
          if (err) throw err;
          res.json({ token, user_id: user._id }); // Devolver el token y el user_id
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error en el servidor");
    }
  }
);

module.exports = router;
