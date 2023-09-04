import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useSelector } from "react-redux";
import AllEventScreen from "./Screens/AllEventScreen";
import Camera from "./Screens/Camera";
import DeleteAccount from "./Screens/DeleteAccount";
import EventDetailsScreen from "./Screens/EventDetailsScreen";
import EventPhotosScreen from "./Screens/EventPhotosScreen";
import EventsHomeScreen from "./Screens/EventsHomeScreen";
import Forgotpassword from "./Screens/ForgotPassword";
import HomeScreen from "./Screens/HomeScreen";
import LinkingDemo from "./Screens/LinkingDemo";
import LoginScreen from "./Screens/LoginScreen";
import MapScreen from "./Screens/MapScreen";
import NotificationScreen from "./Screens/NotificationScreen";
import PostEvent from "./Screens/PostEvent";
import PostEventDetailsScreen from "./Screens/PostEventDetailsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import SignupScreen from "./Screens/SignupScreen";
import SingleEventDetails from "./Screens/SingleEventDetails";
import UploadPhotosScreen from "./Screens/UploadPhotosScreen";
import WeekScreen from "./Screens/WeekScreen";
import WelcomeScreen from "./Screens/WelcomeScreen";
import CalendarScreen from "./Screens/CalendarScreen";
import CalendarEventScreen from "./Screens/CalendarEventScreen";
import CalendarEventDetailScreen from "./Screens/CalendarEventDetailScreen";

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
            name="ForgotPassword"
            component={Forgotpassword}
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
          <Stack.Screen
            name="AllEventScreen"
            component={AllEventScreen}
            options={({ navigation, route }) => ({
              title: "",
              gestureEnabled: route.params?.fromEventPhotosScreen
                ? false
                : true,
              header: () => null,
            })}
          />
          <Stack.Screen
            name="SingleEventDetails"
            component={SingleEventDetails}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DeleteAccount"
            component={DeleteAccount}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="CalendarScreen"
            component={CalendarScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="CalendarEventScreen"
            component={CalendarEventScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="CalendarEventDetailScreen"
            component={CalendarEventDetailScreen}
            options={{ title: "", header: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
