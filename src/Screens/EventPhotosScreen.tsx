import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../Components/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { localized } from "../locales/localization";
import {
  widthPercentageToDP as w2dp,
  heightPercentageToDP as h2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { postEvent } from "../redux/actions/postEventaction";
import Spinner from "react-native-loading-spinner-overlay";
import { getLocation } from "../Components/getCurrentLocation";

const EventPhotosScreen = ({ route }: any) => {
  const { eventPhotos, eventFormData } = route.params;

  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation<string>();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((location: any) => { navigation.navigate("MapScreen", {
      location: location,
    })})
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    // navigation.navigate("MapScreen");
  };

  const submitEvent = async () => {
    setLoading(true);
    const postEventData = {
      eventName: eventFormData?.eventName,
      lat: eventFormData?.lat,
      lng: eventFormData?.long,
      alt: 0,
      fullAddress: eventFormData?.address,
      postalCode: eventFormData?.postalCode,
      state: eventFormData?.state,
      city: eventFormData?.city,
      eventStartDate: eventFormData?.eventDate,
      additionalInfo: eventFormData?.served,
      files: eventPhotos,
    };
    await dispatch(postEvent(postEventData) as any);
    if (eventFormData) {
      setLoading(false);
      navigation.navigate("PostEventDetailsScreen", {
        eventDetails: eventFormData,
        eventPhotos: eventPhotos,
      });
    }
  };

  // const handleModalButtonPress = () => {
  //   navigation.navigate("PostEventDetailsScreen", {
  //     eventDetails: eventFormData,
  //     eventPhotos: eventPhotos,
  //   });
  //   // setSuccess(false);
  // };
  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView>
        {menuOpen && (
          <TouchableWithoutFeedback onPress = {()=>setMenuOpen(false)}>
            <View
            style={{
              position: "absolute",
              right: 60,
              top: 110,
              backgroundColor: "white",
              borderColor: "white",
              borderRadius: 5,
              height: h2dp("13"),
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
            <TouchableOpacity onPress={() => findFoodMenuItemPress("Find Food")}>
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
          </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.row}>
          {/* <Modal
            visible={success}
            onRequestClose={handleModalClose}
            transparent
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.HeaderText}>
                Success!
                </Text>
                  <Text  style={styles.modalText}>Your Event {eventFormData?.eventName} has been posted successfully. Click to see the Event Details</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Next"
                    type="solid"
                    buttonStyle={{
                      backgroundColor: "green",
                      paddingHorizontal: 25,
                      paddingVertical: 10,
                    }}
                    titleStyle={{
                      fontSize: 20,
                    }}
                    onPress={handleModalButtonPress}
                  />
                  <Button title="Cancel" onPress={handleModalClose} />
                </View>
              </View>
            </View>
          </Modal> */}

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
    justifyContent: "center",
    marginTop: 30,
  },
});

export default EventPhotosScreen;
