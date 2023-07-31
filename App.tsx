import { useNetInfo } from "@react-native-community/netinfo";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Alert, Linking, LogBox, Platform, StyleSheet } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { customFonts } from "./src/font";
import Navigation from "./src/Navigation";
import { persistor, store } from "./src/redux/store";
import SplashScreen from "./src/Screens/SplashScreen";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAlertShown, setAlertShown] = useState(false);


  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  const netInfo = useNetInfo();
  useEffect(() => {
    if (netInfo.isConnected === false && !isAlertShown) {
      setAlertShown(true);
      Alert.alert(
        "No Internet",
        "Your internet does not seem to work",
        [
          {
            text: "Open Settings",
            onPress: () => {
              Platform?.OS === "ios"
                ? Linking.openURL("App-Prefs:root=General&path=Network")
                : Linking.sendIntent("android.settings.WIFI_SETTINGS");
            },
          },
        ],
        { cancelable: false },
      );
    }
  }, [netInfo, isAlertShown]);

  useEffect(() => {
     loadFonts();
    setAppIsReady(true);
  }, []);
  if (!fontsLoaded) {
    return;
  }
 
  return (
    <ThemeProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SplashScreen isAppReady={appIsReady}>
        <Navigation />
      </SplashScreen>
      </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
