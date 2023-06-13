import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Screens/LoginScreen";
import Camera from "./Screens/Camera";

import { NavigationContainer } from "@react-navigation/native";
import LinkingDemo from "./Screens/LinkingDemo";
import Notification from "./Screens/Notification";
import WelcomeScreen from "./Screens/WelcomeScreen";
import HomeScreen from "./Screens/HomeScreen";
import MapScreen from "./Screens/MapScreen";
import SignupScreen from "./Screens/SignupScreen";
import EventDetailsScreen from "./Screens/EventDetailsScreen";
import WeekScreen from "./Screens/WeekScreen";
import EventsHomeScreen from "./Screens/EventsHomeScreen";
import PostEvent from "./Screens/PostEvent";
import UploadPhotosScreen from "./Screens/UploadPhotosScreen";
import EventPhotosScreen from "./Screens/EventPhotosScreen";
import PostEventDetailsScreen from "./Screens/PostEventDetailsScreen";

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}  
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="Camera"
            component={Camera}
            options={{ title: "", header: () => null }}
          />

          <Stack.Screen
            name="LinkingDemo"
            component={LinkingDemo}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="WeekScreen"
            component={WeekScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="EventDetailsScreen"
            component={EventDetailsScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="EventsHomeScreen"
            component={EventsHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PostEvent"
            component={PostEvent}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="UploadPhotosScreen"
            component={UploadPhotosScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="EventPhotosScreen"
            component={EventPhotosScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PostEventDetailsScreen"
            component={PostEventDetailsScreen}
            options={{ title: "", header: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
