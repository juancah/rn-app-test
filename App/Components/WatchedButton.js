import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

const WatchedButton = ({ trailerId, user_id, watched, setWatched }) => {
  const handleWatched = async () => {
    setWatched((prevWatched) => ({
      ...prevWatched,
      [trailerId]: !prevWatched[trailerId],
    }));

    try {
      await axios.post(`${BASE_URL}/api/trailers/${trailerId}/watched`, {
        user_id,
      });
    } catch (error) {
      console.error("Error updating watched status:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleWatched}>
      <Ionicons
        name={watched ? "checkmark" : "checkmark-outline"}
        size={30}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default WatchedButton;
