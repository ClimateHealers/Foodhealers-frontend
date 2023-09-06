import { useNetInfo } from "@react-native-community/netinfo";
import * as Font from "expo-font";
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from "react";
import { Alert, Linking, LogBox, Platform, StyleSheet } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { AnyAction } from "redux";
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



  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    const requestPermissionsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Notification Permissions",
          "FoodHealers app needs push notifications permission to send real-time updated on events and announcements from community.You can enable it anytime from settings.",
          [
            {
              text: "Ok",
              // onPress: () => {
              //   Platform?.OS === "ios"
              //     ? Linking.openURL("App-Prefs:root=LOCATION_SERVICES")
              //     : Linking.sendIntent(
              //         "android.settings.LOCATION_SOURCE_SETTINGS"
              //       );
              // },
            },
          ],
          { cancelable: true }
        );
      }
    };
    requestPermissionsAsync();
  }, []);

  const sendPushNotification = async (expoPushToken:AnyAction) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Food healers',
      body: 'Your event is rejected',
      data: { dataKey: 'dataValue',
    
    },  
    };

    console.log("message: ", message);

    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null,
    });
  };
  
  
  // useEffect(() => {
  //   const getExpoPushToken = async () => {
  //     const token = await Notifications.getExpoPushTokenAsync({
  //       projectId : Constants?.manifest?.extra?.eas?.projectID
  //     });
  //     console.log("tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",token);
  //     // sendPushNotification(token);
  //   };
  //   getExpoPushToken();
  // }, []);
  

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
