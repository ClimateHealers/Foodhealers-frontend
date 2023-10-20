import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import IntroSlider from "./Components/IntroSlider";
import AddDonationsScreen from "./Screens/AddDonationsScreen";
import AddDriverScreen from "./Screens/AddDriverScreen";
import AddRequestDonationsScreen from "./Screens/AddRequestDonationsScreen";
import AddVehicleScreen from "./Screens/AddVehicleScreen";
import AddVolunteerToEvent from "./Screens/AddVolunteerToEventScreen";
import AllEventScreen from "./Screens/AllEventScreen";
import AllVolunteersScreen from "./Screens/AllVolunteersScreen";
import BecomeADriverScreen from "./Screens/BecomeADriverScreen";
import CalendarEventDetailScreen from "./Screens/CalendarEventDetailScreen";
import CalendarEventScreen from "./Screens/CalendarEventScreen";
import CalendarScreen from "./Screens/CalendarScreen";
import Camera from "./Screens/Camera";
import CategoryScreen from "./Screens/CategoryScreen";
import DeleteAccount from "./Screens/DeleteAccount";
import DonationTabScreen from "./Screens/DonationTabScreen";
import DriverPhotoSaveScreen from "./Screens/DriverPhotoSaveScreen";
import DriverProfilePhoto from "./Screens/DriverProfilePhoto";
import DriverProfileScreen from "./Screens/DriverProfileScreen";
import DriverRequestScreen from "./Screens/DriverRequestScreen";
import EventDetailsScreen from "./Screens/EventDetailsScreen";
import EventPhotosScreen from "./Screens/EventPhotosScreen";
import EventsHomeScreen from "./Screens/EventsHomeScreen";
import FindFoodHomeScreen from "./Screens/FindFoodHomeScreen";
import Forgotpassword from "./Screens/ForgotPassword";
import HomeScreen from "./Screens/HomeScreen";
import LinkingDemo from "./Screens/LinkingDemo";
import LoginScreen from "./Screens/LoginScreen";
import MapScreen from "./Screens/MapScreen";
import NotificationScreen from "./Screens/NotificationScreen";
import PickupConfirmScreen from "./Screens/PickupConfirmScreen";
import PickupDetailsScreen from "./Screens/PickupDetailsScreen";
import PickupSelectedDetailsScreen from "./Screens/PickupSelectedDetailsScreen";
import PostEvent from "./Screens/PostEvent";
import PostEventDetailsScreen from "./Screens/PostEventDetailsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import RecipesHomeScreen from "./Screens/RecipesHomeScreen";
import RequestCreatedScreen from "./Screens/RequestCreatedScreen";
import AcceptRequestedDonationScreen from "./Screens/AcceptRequestedDonationScreen";
import RequestHistoryScreen from "./Screens/RequestHistoryScreen";
import SeeExistingDonationScreen from "./Screens/SeeExistingDonationScreen";
import SignupScreen from "./Screens/SignupScreen";
import SingleEventDetails from "./Screens/SingleEventDetails";
import SingleRecipeScreen from "./Screens/SingleRecipeScreen";
import TeamHomeScreen from "./Screens/TeamHomeScreen";
import UploadPhotosScreen from "./Screens/UploadPhotosScreen";
import VolunteerAndDonateScreen from "./Screens/VolunteerAndDonateScreen";
import VolunteerDonateScreen from "./Screens/VolunteerDonateScreen";
import VolunteerDonationHistoryScreen from "./Screens/VolunteerDonationHistoryScreen";
import VolunteerEventHistoryScreen from "./Screens/VolunteerEventHistoryScreen";
import VolunteerEventScreen from "./Screens/VolunteerEventScreen";
import VolunteerHomeScreen from "./Screens/VolunteerHomeScreeen";
import VolunteerSingleEventDetails from "./Screens/VolunteerSingleEventDetails";
import VolunteerThankYouScreen from "./Screens/VolunteerThankYouScreen";
import WeekScreen from "./Screens/WeekScreen";
import WelcomeScreen from "./Screens/WelcomeScreen";
import RequestFoodHomeScreen from "./Screens/RequestFoodHomeScreen";
import SeeExistingRequestScreen from "./Screens/SeeExistingRequestScreen";
import AcceptDonatedRequestScreen from "./Screens/AcceptDonatedRequestScreen";
import TakePictureScreen from "./Screens/TakePictureScreen";
import PickupHistoryScreen from "./Screens/PickupHistoryScreen";
import HistoryScreen from "./Screens/HistoryScreen";

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
            name="FindFoodHomeScreen"
            component={FindFoodHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="RecipesHomeScreen"
            component={RecipesHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="SingleRecipeScreen"
            component={SingleRecipeScreen}
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
              gestureEnabled: route?.params?.fromEventPhotosScreen
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
          <Stack.Screen
            name="IntroSlider"
            component={IntroSlider}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerHomeScreen"
            component={VolunteerHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerDonateScreen"
            component={VolunteerDonateScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerAndDonateScreen"
            component={VolunteerAndDonateScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DonationTabScreen"
            component={DonationTabScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AddDonationsScreen"
            component={AddDonationsScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerThankYouScreen"
            component={VolunteerThankYouScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerDonationHistoryScreen"
            component={VolunteerDonationHistoryScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerEventScreen"
            component={VolunteerEventScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AddVolunteerToEventScreen"
            component={AddVolunteerToEvent}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerEventHistoryScreen"
            component={VolunteerEventHistoryScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="VolunteerSingleEventDetails"
            component={VolunteerSingleEventDetails}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AllVolunteersScreen"
            component={AllVolunteersScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="BecomeADriverScreen"
            component={BecomeADriverScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AddDriverScreen"
            component={AddDriverScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AddVehicleScreen"
            component={AddVehicleScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DriverProfilePhoto"
            component={DriverProfilePhoto}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DriverPhotoSaveScreen"
            component={DriverPhotoSaveScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DriverProfileScreen"
            component={DriverProfileScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="SeeExistingDonationScreen"
            component={SeeExistingDonationScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="TeamHomeScreen"
            component={TeamHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="RequestFoodHomeScreen"
            component={RequestFoodHomeScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AddRequestDonationsScreen"
            component={AddRequestDonationsScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="RequestCreatedScreen"
            component={RequestCreatedScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="RequestHistoryScreen"
            component={RequestHistoryScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PickupDetailsScreen"
            component={PickupDetailsScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PickupSelectedDetailsScreen"
            component={PickupSelectedDetailsScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PickupConfirmScreen"
            component={PickupConfirmScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="DriverRequestScreen"
            component={DriverRequestScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AcceptRequestedDonationScreen"
            component={AcceptRequestedDonationScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="SeeExistingRequestScreen"
            component={SeeExistingRequestScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="AcceptDonatedRequestScreen"
            component={AcceptDonatedRequestScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="TakePictureScreen"
            component={TakePictureScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="PickupHistoryScreen"
            component={PickupHistoryScreen}
            options={{ title: "", header: () => null }}
          />
          <Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
            options={{ title: "", header: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
