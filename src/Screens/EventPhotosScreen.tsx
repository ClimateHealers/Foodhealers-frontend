import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { localized } from "../locales/localization";

import { removeAuthData } from "../redux/actions/authAction";
import { Button } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import { postEvent } from "../redux/actions/postEventaction";
import { logOut } from "../redux/reducers/authreducers";
// import { NavigationActions } from 'react-navigation';

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
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
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
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView>
        {menuOpen && (
          <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
            <View
              style={{
                position: "absolute",
                right: 60,
                top: Platform.OS === "ios" ? h2dp(13.2) : h2dp(9),
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: 5,
                height: h2dp("17"),
                width: w2dp("32"),
                zIndex: 9999,
              }}
            >
              <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "300",
                    lineHeight: 27.24,
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => findFoodMenuItemPress("Find Food")}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "300",
                    lineHeight: 27.24,
                  }}
                >
                  Find Food
                </Text>
              </TouchableOpacity>
              {isAuthenticated && (
                <TouchableOpacity onPress={() => logout("logout")}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    Log out
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.row}>
          <Modal
            visible={showDialog}
            onRequestClose={() => navigation.navigate("EventPhotsScreen")}
            transparent
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.HeaderText}>Submitted your event</Text>
                <Text style={styles.modalText}>
                  Your event "{eventFormData?.eventName}" has been submitted,
                  awaiting approval from Admin. If you wish to change event
                  details, please click on Resubmit
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

          <View style={styles.item}>
            <Text style={styles.itemText}>{"Post an Event"}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons
              name="menu"
              size={40}
              color="white"
              onPress={toggleMenu}
            />
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color="white"
            style={{ marginLeft: 15 }}
            onPress={() => navigation.goBack()}
          />
          <Text style={{ fontSize: 25, marginLeft: 30, color: "white" }}>
            Selected Photos
          </Text>
        </View>

        <View style={styles.card}>
          {eventPhotos.map((imageUri: any, index: any) => (
            <View style={{ margin: 5 }} key={index}>
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
            // onPress={() => {
            //  if(eventFormData){
            //   navigation.navigate("PostEventDetailsScreen", {
            //     eventDetails: eventFormData,
            //     eventPhotos: eventPhotos,
            //   });
            //  }
            // }}
            onPress={submitEvent}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  item: {
    marginRight: 35,
    height: 100,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginRight: 20,
  },

  card: {
    width: "90%",
    height: "65%",
    marginLeft: 20,
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-start",

    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,

    marginLeft: 85,
  },
  titleStyle: {
    color: "white",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  cardTextConainer: {
    marginTop: 30,
  },
  cardText: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "OpenSans-Light",
  },
  boldText: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
  },
  HeaderText: {
    fontSize: 20,
    textAlign: "left",
    color: "white",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    textAlign: "left",
    color: "white",
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
});

export default EventPhotosScreen;
