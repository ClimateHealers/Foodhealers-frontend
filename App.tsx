import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  LogBox,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { Text as TextRN } from "react-native-paper";
import Navigation from "./src/Navigation";
import SplashScreen from "./src/Screens/SplashScreen";
import { customFonts } from "./src/font";
import { persistor, store } from "./src/redux/store";
import "react-native-get-random-values";

(TextRN as any).defaultProps ??= {};
(Text as any).defaultProps ??= {};
(TextInput as any).defaultProps ??= {};
(TextRN as any).defaultProps.allowFontScaling =
  (Text as any).defaultProps.allowFontScaling =
  (TextInput as any).defaultProps.allowFontScaling =
    false;

LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAlertShown, setAlertShown] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const navigationRef = useNavigationContainerRef();
  const currentRouteNameRef = useRef<string>();
  const lastBackPress = useRef<number>(0);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  let lastBackPressed: number = 0;

  const netInfo = useNetInfo();

  useEffect(() => {
    (async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
      setIsAppReady(true);
    })();
  }, []);

  useEffect(() => {
    if (netInfo?.isConnected === false && !isAlertShown) {
      setAlertShown(true);
      Alert.alert("No Internet", "Your internet does not seem to work", [
        {
          text: "Open Settings",
          onPress: () => {
            Platform.OS === "ios"
              ? Linking.openURL("App-Prefs:root=General&path=Network")
              : Linking.sendIntent("android.settings.WIFI_SETTINGS");
          },
        },
      ]);
    }
  }, [netInfo?.isConnected, isAlertShown]);

  useEffect(() => {
    const backAction = () => {
      const currentRoute = navigationRef.getCurrentRoute()?.name;
      const now = Date.now();

      if (currentRoute === "HomeScreen") {
        if (lastBackPressed && now - lastBackPressed < 2000) {
          BackHandler.exitApp();
        } else {
          lastBackPressed = now;
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        }
        return true;
      }

      // For all other screens, go back normally
      navigationRef.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const setupNotifications = async () => {
      if (!Device.isDevice) {
        Alert.alert("Push notifications require a physical device.");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Notification Permissions",
          "Enable push notifications in settings.",
          [
            {
              text: "Open Settings",
              onPress: () => {
                Platform.OS === "ios"
                  ? Linking.openURL("App-Prefs:root=NOTIFICATIONS_ID")
                  : Linking.sendIntent(
                      "android.settings.APP_NOTIFICATION_SETTINGS"
                    );
              },
            },
            { text: "Close" },
          ]
        );
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.appConfig?.expo?.extra?.eas?.apikey,
      });
      setExpoPushToken(tokenData.data);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    setupNotifications();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SplashScreen isAppReady={isAppReady}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                currentRouteNameRef.current =
                  navigationRef.getCurrentRoute()?.name ?? "";
              }}
              onStateChange={() => {
                const currentRoute =
                  navigationRef.getCurrentRoute()?.name ?? "";
                currentRouteNameRef.current = currentRoute;
              }}
            >
              <Navigation />
            </NavigationContainer>
          </SplashScreen>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
