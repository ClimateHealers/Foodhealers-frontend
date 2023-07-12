import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/Navigation";
import { persistor, store, } from "./src/redux/store";
import { ThemeProvider } from "react-native-elements";
import { customFonts, loadFonts } from "./src/font";
import * as Font from "expo-font";
import SplashScreen from "./src/Screens/SplashScreen";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

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
