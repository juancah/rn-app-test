// styles.js
import { StyleSheet, Dimensions } from "react-native";
import { theme } from "./theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  trailerName: {
    fontSize: theme.fonts.bold,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    position: "absolute",
    top: 50,
    left: 20,
  },
  trailerDescription: {
    fontSize: theme.fonts.regular,
    color: theme.colors.textSecondary,
    position: "absolute",
    bottom: 50,
    left: 20,
  },
  controls: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  actions: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  progressBar: {
    position: "absolute",
    width: "80%",
  },
});
