import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const LikeButton = ({ trailerId, user_id, liked, setLikes }) => {
  const BASE_URL = "http://10.0.0.71:5001/api/trailers";

  const handleLike = async () => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [trailerId]: !prevLikes[trailerId],
    }));

    try {
      await axios.post(`${BASE_URL}/${trailerId}/like`, { user_id });
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Ionicons
        name={liked ? "thumbs-up" : "thumbs-up-outline"}
        size={30}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default LikeButton;
