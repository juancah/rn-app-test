import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./Components/LoginScreen"; // Importar pantalla de login
import RegisterScreen from "./Components/RegisterScreen"; // Importar pantalla de registro
import TrailersList from "./Components/TrailersList"; // Importar la lista de tráileres

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pantalla de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Pantalla de Registro */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Pantalla de Inicio (Lista de Tráileres) */}
        <Stack.Screen
          name="Home"
          component={TrailersList}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
