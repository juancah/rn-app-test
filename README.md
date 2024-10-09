# Cambios


## Front
### Instalar expo-image-picker
Instalalo con este comando:
```
npx expo install expo-image-picker
```
y agregas esta linea a app.json:
```json
{
 "expo":{
    ...
    "plugins": ["expo-image-picker"],
    ...
 },
 ...
}
```
### entry.js:
Crea un archivo llamado `entry.js` en el root de la App con este código.

```javascript
import '@expo/metro-runtime';

import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from './App';

registerRootComponent(App);
```
el código es casi lo mismo que el código de Expo pero se agregó `expo/metro-runtime` para que haga fast refresh en web.
normalmente se utiliza expo-router en vez de @react-navigation porque funciona mejor con expo y ya tiene esto configurado por default.

### LoginScreen.js:
```javascript
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Image } from "react-native";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,

        {
          email,
          password,
        }
      );
      // Si el login es exitoso, obtén el user_id del servidor
      const { user_id } = res.data; // Asegúrate de que tu backend devuelve el user_id
      console.log("Login exitoso, User ID:", user_id);

      // Redirige a la pantalla Home pasando el user_id
      navigation.navigate("Home", { user_id }); // Pasamos el user_id al navegar a la pantalla Home
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Credenciales no válidas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="No tienes cuenta? Regístrate"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 4,
  },
});

export default LoginScreen;

```

### RegisterScreen.js:
```javascript
//Reguster.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
//import { Image } from "expo-image";

//mport { Image } from "expo-image";
import { Image, ImageBackground } from "expo-image";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

import axios from "axios";

const convertImageToBlob = async (imagePath) => {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return blob;

};


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Solicitar permisos de acceso a la galería
  useEffect(() => {
    const getPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permisos para acceder a tu galería"
        );
      }
    };
    getPermission();
  }, []);

  // Función para seleccionar imagen
  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log('aa',pickerResult)

    if (!pickerResult.cancelled && (Array.isArray(pickerResult.assets) && pickerResult.assets?.length > 0) ) {
      const asset = pickerResult.assets[0]
      setAvatar(asset.uri);
    }
  };

  const handleRegister = async () => {
    try {
      const userData = {
        name,
        user_name: userName,
        email,
        password,
        google_id: null,
      };

      // Mostrar en consola los datos que se están enviando
      console.log("Datos enviados:", userData);
      if (avatar) {
        const formData = new FormData();
        const blob = await convertImageToBlob(avatar) //convertir uri a blob porque el server no lo reconocia como imagen al codigo de antes
        formData.append("avatar",blob);
        const res = await axios.post(
          `${BASE_URL}/api/upload`, // Cambia según tu IP local
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Verificar la URL de la imagen
        if (res.data && res.data.imageUrl) {
          userData.profile_image = res.data.imageUrl;
        } else {
          throw new Error("Error al obtener la URL de la imagen");
        }
      }

      // Enviar los datos del usuario al backend
      const registerRes = await axios.post(
        `${BASE_URL}/api/auth/register`, // Cambia según tu IP local
        userData
      );

      console.log("Respuesta del servidor:", registerRes.data);

      if (registerRes.status === 201 || registerRes.status === 200) {
        Alert.alert("Éxito", "Registro exitoso");
        navigation.navigate("Login");
      } else {
        throw new Error("Error durante el registro");
      }
    } catch (err) {
      console.error("Error durante el registro", err);
      Alert.alert("Error", "No se pudo registrar el usuario");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón para seleccionar avatar */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Seleccionar Avatar</Text>
      </TouchableOpacity>

      {/* Mostrar el avatar si se selecciona */}
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}

      {/* Botón para registrar */}
      <Button title="Registrar" onPress={handleRegister} />
      <Button
        title="Ya tienes cuenta? Inicia sesión"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default RegisterScreen;

```

## Backend
### Pon este package.json (nodemon es para que se refresque cuando hay cambios):
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-validator": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.3",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0"
  },
  "packageManager": "yarn@1.22.21+sha1.1959a18351b811cdeedbd484a8f86c3cc3bbaf72",
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}

```


### server.js
```javascript
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
  },
});

// Configurar multer para manejar la carga de imágenes
const upload = multer({ storage });

// Ruta para subir imágenes a Cloudinary
app.post("/api/upload", upload.single("avatar"), (req, res) => {
  try {
    if(!req.file)throw new Error('No se encontro ninguna imagen')
    // Devuelve la URL de la imagen subida
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    res.status(500).json({ message: "Error al subir la imagen" ,error});
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

```
