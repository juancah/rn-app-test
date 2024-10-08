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
