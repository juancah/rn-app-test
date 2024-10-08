const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Trailer = require("./models/Trailer");
const Like = require("./models/Likes");

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Conectado a MongoDB");

    // Crear un nuevo tráiler
    const newTrailer = new Trailer({
      name: "Inception 4",
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
      name: "John Doe2",
      email: "johndoe3232@examplwwwe.com",
      user_name: "johndoe1234567",
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

    console.log("Datos guardados correctamente");
    mongoose.disconnect(); // Desconectamos después de guardar los datos
  })
  .catch((err) => {
    console.error("Error al conectarse a MongoDB:", err);
  });
