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
//import * as ImagePicker from "expo-image-picker";
//import { Image } from "expo-image";

//mport { Image } from "expo-image";
import { Image, ImageBackground } from "expo-image";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

import axios from "axios";

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

    if (!pickerResult.cancelled) {
      setAvatar(pickerResult.uri);
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
        const filename = avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type: fileType,
        });

        const res = await axios.post(
          `${BASE_URL}api/upload`, // Cambia según tu IP local
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
