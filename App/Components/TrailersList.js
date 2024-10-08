import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons"; // Para íconos como play/pause/mute
import * as Sharing from "expo-sharing"; // Para compartir tráileres
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import WatchedButton from "./WatchedButton";
import { styles } from "../Theme/styles"; // Importa los estilos
//import { Image } from "expo-image";
//import { ImageBackground } from "react-native";
import { Image, ImageBackground } from "expo-image";
import { BASE_URL } from "../config"; // Importa la URL desde config.js

const { width, height } = Dimensions.get("window"); // Ancho y altura de la pantalla
const videoHeight = (width * 9) / 16; // Mantiene la proporción 16:9

const TrailersList = ({ route }) => {
  const { user_id } = route.params; // Extraemos user_id de los parámetros de navegación
  const [trailers, setTrailers] = useState([]); // Estado para almacenar los tráileres
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [isMuted, setIsMuted] = useState(false); // Estado para mute/unmute
  const [isPlaying, setIsPlaying] = useState(true); // Estado para play/pause
  const [currentIndex, setCurrentIndex] = useState(0); // Índice actual
  const [videoPosition, setVideoPosition] = useState(0); // Posición actual del video
  const [videoDuration, setVideoDuration] = useState(1); // Duración del video
  const [likes, setLikes] = useState({}); // Inicializa el estado para likes
  const [dislikes, setDislikes] = useState({}); // Inicializa el estado para dislikes
  const [watched, setWatched] = useState({}); // Inicializa el estado para marcar como visto
  const [watchList, setWatchList] = useState({}); // Inicializa el estado para lista de ver después
  const flatListRef = useRef(null); // Referencia para el FlatList
  const videoRefs = useRef([]); // Referencia para manejar múltiples videos

  useEffect(() => {
    console.log("User ID recibido:", user_id);
  }, [user_id]);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/trailers`); // Obtener los tráileres
        setTrailers(response.data); // Guardar los tráileres en el estado
        setLoading(false); // Cambiar el estado de carga
      } catch (err) {
        setError(err); // Guardar el error en el estado
        setLoading(false);
      }
    };

    const fetchVideoStatus = async (trailer_id) => {
      try {
        const response = await axios.post(`${BASE_URL}/videoStatus`, {
          user_id,
          trailer_id,
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching video status:", error);
      }
    };

    const fetchWatched = async () => {
      try {
        // Llamada a la API para obtener los tráileres que el usuario ha marcado como vistos
        const watchedResponse = await axios.post(`${BASE_URL}/watchedStatus`, {
          user_id,
        });
        const watchedData = watchedResponse.data; // Supongo que devuelve un array de IDs de tráileres

        // Crear un objeto con el estado de los tráileres vistos
        const watchedState = watchedData.reduce((acc, trailerId) => {
          acc[trailerId] = true;
          return acc;
        }, {});
        setWatched(watchedState); // Guardar el estado en watched
      } catch (err) {
        console.error("Error fetching watched status:", err);
      }
    };

    fetchTrailers(); // Llamar la función para cargar tráileres
    fetchWatched(); // Llamar la función para cargar el estado de watched
  }, [user_id]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) return <Text>Cargando tráileres...</Text>;

  // Mostrar un mensaje de error si hubo un problema
  if (error)
    return (
      <Text style={styles.errors}>
        {" "}
        Error al cargar tráileres: {error.message}
      </Text>
    );

  // Función para manejar el desplazamiento y pausar los videos fuera de la vista
  const handleScroll = async (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(scrollPosition / height); // Usa la altura completa de la pantalla

    if (newIndex !== currentIndex) {
      // Pausar el video actual y reiniciarlo
      if (videoRefs.current[currentIndex]) {
        try {
          await videoRefs.current[currentIndex].pauseAsync();
          await videoRefs.current[currentIndex].setPositionAsync(0); // Reiniciar el video
        } catch (error) {
          console.log("Error during seeking or pausing video:", error);
        }
      }

      setCurrentIndex(newIndex);

      // Reproducir el nuevo video que entra en pantalla
      if (videoRefs.current[newIndex]) {
        try {
          await videoRefs.current[newIndex].playAsync();
        } catch (error) {
          console.log("Error during playing video:", error);
        }
      }
    }
  };

  // Función para alternar entre play/pause
  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await videoRefs.current[currentIndex].pauseAsync();
      } else {
        await videoRefs.current[currentIndex].playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error during play/pause:", error);
    }
  };

  // Función para alternar mute/unmute
  const toggleMute = async () => {
    try {
      const newMutedState = !isMuted;
      await videoRefs.current[currentIndex].setIsMutedAsync(newMutedState);
      setIsMuted(newMutedState);
    } catch (error) {
      console.error("Error during mute/unmute:", error);
    }
  };

  // Función para manejar "watchlist"
  const handleAddToWatchList = async (trailerId) => {
    setWatchList((prevWatchList) => ({
      ...prevWatchList,
      [trailerId]: !prevWatchList[trailerId],
    }));
    try {
      await axios.post(`${BASE_URL}/${trailerId}/watchlist`, {
        user_id,
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  // Función para compartir tráiler
  const shareTrailer = async (trailerUrl) => {
    try {
      await Sharing.shareAsync(trailerUrl);
    } catch (error) {
      console.error("Error sharing trailer:", error);
    }
  };

  // Función para renderizar cada video
  const renderItem = ({ item, index }) => {
    const videoHeight = (width * 9) / 16 + 50; // Añadir 50px para hacerlo un poco más alto

    return (
      <View style={styles.videoContainer}>
        <Text style={styles.trailerName}>{item.name}</Text>

        {/* Renderizar el video */}
        <Video
          ref={(ref) => {
            videoRefs.current[index] = ref; // Asigna la referencia del video
          }}
          source={{ uri: item.video_URL }} // Asegúrate de tener la URL del video
          style={{ width: "110%", height: videoHeight }}
          resizeMode="stretch" // Usamos "contain" para mantener la proporción 16:9
          isLooping
          volume={1.0} // Ajusta el volumen del video
          isMuted={isMuted} // Usa el estado para mute/unmute
          shouldPlay={index === currentIndex} // Solo reproducir el video actual
          useNativeControls={false} // Puedes activar los controles nativos si lo deseas
          onPlaybackStatusUpdate={(status) => {
            setVideoPosition(status.positionMillis);
            setVideoDuration(status.durationMillis || 1);
          }}
          onError={(e) => console.log("Error al cargar video: ", e)}
        />

        {/* Botones de control */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Botones de acciones */}
        <View style={styles.actions}>
          {/* Botón de like */}
          <LikeButton
            trailerId={item._id}
            user_id={user_id}
            likes={likes}
            setLikes={setLikes}
          />

          {/* Botón de dislike */}
          <DislikeButton
            trailerId={item._id}
            user_id={user_id}
            dislikes={dislikes}
            setDislikes={setDislikes}
          />

          {/* Botón de marcar como visto */}
          <WatchedButton
            trailerId={item._id}
            user_id={user_id}
            watched={watched[item._id]} // Pasar el valor correspondiente
            setWatched={setWatched}
          />

          {/* Botón de agregar a lista */}
          <TouchableOpacity onPress={() => handleAddToWatchList(item._id)}>
            <Ionicons
              name={watchList[item._id] ? "eye" : "eye-outline"}
              size={30}
              color="white"
            />
          </TouchableOpacity>

          {/* Botón de compartir */}
          <TouchableOpacity onPress={() => shareTrailer(item.video_URL)}>
            <Ionicons name="share-social" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <Slider
          style={[styles.progressBar, { top: videoHeight - 10 }]} // Dinámico basado en la altura del video
          minimumValue={0}
          maximumValue={1}
          value={videoPosition / videoDuration}
          onSlidingStart={async () => {
            // Pausar el video mientras el usuario ajusta la posición
            try {
              await videoRefs.current[currentIndex].pauseAsync();
            } catch (error) {
              console.error(
                "Error during pausing video before seeking:",
                error
              );
            }
          }}
          onSlidingComplete={async (value) => {
            const seekPosition = value * videoDuration;
            try {
              await videoRefs.current[currentIndex].setPositionAsync(
                seekPosition
              );
              await videoRefs.current[currentIndex].playAsync(); // Reanudar la reproducción después de buscar
            } catch (error) {
              console.error("Error during seeking video:", error);
            }
          }}
          minimumTrackTintColor="white"
          maximumTrackTintColor="gray"
        />

        <Text style={styles.trailerDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={trailers}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ref={flatListRef}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      getItemLayout={(data, index) => ({
        length: height, // Cada contenedor tiene la altura completa de la pantalla
        offset: height * index, // Calcula el desplazamiento para que solo se vea un video a la vez
        index,
      })}
    />
  );
};

export default TrailersList;
