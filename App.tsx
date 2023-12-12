import { useNetInfo } from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, LogBox, Platform, StyleSheet, Text, TextInput } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/Navigation";
import SplashScreen from "./src/Screens/SplashScreen";
import { customFonts } from "./src/font";
import { persistor, store } from "./src/redux/store";
import { Text as TextRN} from "react-native-paper";

// fix Font scaling React-Native-Paper TextInput Component
// https://stackoverflow.com/questions/65192622/initializing-text-defaultprops-with-typescript
if ((TextRN as any).defaultProps == null) (TextRN as any).defaultProps = {};
(TextRN as any).defaultProps.allowFontScaling = false; 

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAlertShown, setAlertShown] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

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
          "FoodHealers app needs push notifications permission to send real-time updated events and announcements from community.You can enable it anytime from settings.",
          [
            {
              text: "open settings",
              onPress: () => {
                Platform?.OS === "ios"
                  ? Linking.openURL("App-Prefs:root=LOCATION_SERVICES")
                  : Linking.sendIntent(
                      "android.settings.LOCATION_SOURCE_SETTINGS"
                    );
              },
            },
            {
              text: "Close",
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

    // React-native Text Component
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false; 

    // React-native TextInput Component
    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
    (TextInput as any).defaultProps.allowFontScaling = false; 


  }, []);

  const sendPushNotification = async (expoPushToken: any) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Food healers",
      body: "Welcome!!!",
      data: { dataKey: "dataValue" },
    };

    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null,
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device?.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.appConfig?.expo?.extra?.eas?.apikey,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token?.data;
  }

  const netInfo = useNetInfo();
  useEffect(() => {
    if (netInfo?.isConnected === false && !isAlertShown) {
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
        { cancelable: false }
      );
    }
    registerForPushNotificationsAsync().then((token) => {
      return (
        setExpoPushToken(token as any)
      )
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log(null);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener?.current
      );
      Notifications.removeNotificationSubscription(responseListener?.current);
    };
  }, [netInfo, isAlertShown]);

  useEffect(() => {
    loadFonts();
    setAppIsReady(true);
    sendPushNotification(expoPushToken);
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
