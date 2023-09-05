import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { Alert, Linking, Platform } from "react-native";

// export const getExpoPushToken = async () => {
//   const token = await Notifications.getExpoPushTokenAsync({
//     projectId : Constants?.manifest?.extra?.eas?.projectID
//   });
//   console.log("checking token from for notifications", token);
//   return token;
//   // sendPushNotification(token);
// };

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

 export async function sendPushNotification(expoPushToken:any) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  

  
export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Enable Notifications",
        "Food Healers app requires notifications in order to provide you real time updates about food events.",
        [
          {
            text: "Open settings",
            onPress: () => {
              Platform?.OS === "ios"
                ? Linking.openURL("App-Prefs:root=LOCATION_SERVICES")
                : Linking.sendIntent(
                    "android.settings.LOCATION_SOURCE_SETTINGS"
                  );
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.manifest?.extra?.eas?.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
