import * as Location from "expo-location";
import { Alert } from "react-native";

export const getLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("permission to access location was denied");
      Alert.alert(
        "Location permission denied",
        "Please grant permission to access your location to use this feature.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }
    let location = await Location.getLastKnownPositionAsync({});
    if (location) {
      return location;
    } else {
    }
  } catch (error) {
    console.error(error);
  }
};
