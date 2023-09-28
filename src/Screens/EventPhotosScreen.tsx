import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { Button } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import {
  heightPercentageToDP as h2dp
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { removeAuthData } from "../redux/actions/authAction";
import { postEvent } from "../redux/actions/postEventaction";
import { logOut } from "../redux/reducers/authreducers";

const EventPhotosScreen = ({ route }: any) => {
  const { eventPhotos, eventFormData, singlePhoto } = route.params;

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const navigation: any = useNavigation<string>();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
    // navigation.navigate("MapScreen");
  };
  const logout = async (item: any) => {
    // persistor.purge()
    await dispatch(logOut({}) as any);
    await removeAuthData();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  const submitEvent = () => {
    setShowDialog(true);
  };
  const formData = new FormData();
  formData.append("eventName", eventFormData?.eventName);
  formData.append("lat", eventFormData?.lat);
  formData.append("lng", eventFormData?.long);
  formData.append("alt", "0");
  formData.append("fullAddress", eventFormData?.address);
  formData.append("postalCode", eventFormData?.postalCode);
  formData.append("state", eventFormData?.state);
  formData.append("city", eventFormData?.city);
  formData.append("eventStartDate", eventFormData?.eventDate);
  formData.append("eventEndDate", eventFormData?.eventEndDateTime);
  formData.append("additionalInfo", eventFormData?.served);
  formData.append("requiredVolunteers", eventFormData?.volunteers);
  // formData.append("files",photo)
  formData.append("files", {
    uri: singlePhoto,
    type: "image/jpeg",
    name: `${eventFormData?.eventDate}.jpg`,
  });

  const naivgateToAllEvents = async () => {
    try {
      setLoading(true);

      await dispatch(postEvent(formData as any) as any);

      setLoading(false);

      navigation.navigate("AllEventScreen", { fromEventPhotosScreen: true });
      setShowDialog(false);
    } catch (error) {
      console.log("firstfirstfirstfirst", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>Post an Event</Text>
                </View>
                <View style={styles.item}>
                  <BurgerIcon />
                </View>
              </View>
                <Modal
                  visible={showDialog}
                  onRequestClose={() =>
                    navigation.navigate("EventPhotosScreen")
                  }
                  transparent
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.HeaderText}>
                        Submitted your event
                      </Text>
                      <Text style={styles.modalText}>
                        Your event "{eventFormData?.eventName}" has been
                        submitted, awaiting approval from Admin. If you wish to
                        change event details, please click on Resubmit
                      </Text>
                      <View style={styles.buttonContainer}>
                        <Button
                          title="Resubmit"
                          type="solid"
                          buttonStyle={{
                            backgroundColor: "green",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                          }}
                          titleStyle={{
                            fontSize: 20,
                          }}
                          onPress={() => navigation.navigate("PostEvent")}
                        />
                        <Button
                          title="Next"
                          type="solid"
                          buttonStyle={{
                            backgroundColor: "green",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                          }}
                          titleStyle={{
                            fontSize: 20,
                          }}
                          onPress={naivgateToAllEvents}
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ fontSize: 25, color: "white" }}>
                  Selected Photos
                </Text>
              </View>

              <View style={[styles.card,{
                height: h2dp(40),
                borderRadius: h2dp(1),
                alignItems: "center",
                marginTop: h2dp(2),
              }]}>
                {eventPhotos.map((imageUri: any, index: any) => (
                  <View style={{ marginTop: h2dp(3), justifyContent: "center", }} key={index}>
                    <Image
                      key={index}
                      source={{ uri: imageUri }}
                      style={{ width: 100, height: 100 }}
                    />
                  </View>
                ))}
              </View>
              <View>
                <Spinner
                  visible={loading}
                  textContent="Posting event"
                  cancelable={false}
                  textStyle={{
                    color: "white",
                  }}
                />
                <PrimaryButton
                  title={"Submit"}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={submitEvent}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EventPhotosScreen;
