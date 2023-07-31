import * as Location from "expo-location";
import { Linking, Platform } from "react-native";
import { Alert } from "react-native";

export const getLocation = async () => {
  try {
    const checkingPermisssion = await Location.hasServicesEnabledAsync();
    if(checkingPermisssion) {
    let { status } = await Location?.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("permission to access location was denied");
      Alert.alert(
        "Location permission denied",
        "Please grant permission to access your location to use this feature.",
        [{ text: "Open settings", onPress: () => Linking.openSettings() }],
        { cancelable: true }
      );
      return;
    }
    let location = Platform.OS === "ios" ?  await Location.getLastKnownPositionAsync({}) : await Location.getCurrentPositionAsync({}) 
    if (location) {
      return location;
    }
  }else{
    Alert.alert(
      "Please turn on your location",
      "Please grant permission to access your location to use this feature.",
      [{ text: "Open settings",   onPress: () => {
        Platform?.OS === "ios"
          ? Linking.openURL("App-Prefs:root=LOCATION_SERVICES")
          : Linking.sendIntent(
              "android.settings.LOCATION_SOURCE_SETTINGS",
            );
      }}],
      { cancelable: true }
    );
  }
  } catch (error) {
    console.error(error);
  }
};
