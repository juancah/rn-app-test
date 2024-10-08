import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

const DislikeButton = ({ trailerId, user_id, disliked, setDislikes }) => {
  const handleDislike = async () => {
    setDislikes((prevDislikes) => ({
      ...prevDislikes,
      [trailerId]: !prevDislikes[trailerId],
    }));

    try {
      await axios.post(`${BASE_URL}/api/trailers/${trailerId}/dislike`, {
        user_id,
      });
    } catch (error) {
      console.error("Error updating dislike status:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleDislike}>
      <Ionicons
        name={disliked ? "thumbs-down" : "thumbs-down-outline"}
        size={30}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default DislikeButton;
