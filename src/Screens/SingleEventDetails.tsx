import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";

const SingleEventDetails = ({ route }: any) => {
  const { eventDetails } = route.params;
  const navigation: any = useNavigation();
  const [menuClose, setMenuOpen] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "French", value: "fr" },
    { id: 2, label: "Hindi", value: "hi" },
    { id: 3, label: "Bengali", value: "be" },
    { id: 4, label: "Chinese", value: "ch" },
    { id: 5, label: "Mandarin", value: "ma" },
    { id: 6, label: "Punjabi", value: "pu" },
    { id: 7, label: "English", value: "en" },
    { id: 8, label: "Spanish", value: "es" },
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const startTime = eventDetails?.eventStartDate;
  const formattedStartTime = moment(startTime).format("h:mm a");

  const EndTime = eventDetails?.eventEndDate;
  const formattedEndTime = moment(EndTime).format("h:mm a");

  console.log(
    "checking formatted start and end time",
    formattedStartTime,
    formattedEndTime
  );

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  const navigationHandler = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${eventDetails?.lat},${eventDetails?.long}`;
    Linking.openURL(url);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `I'm attending ${eventDetails?.name} Event.

From ${moment(eventDetails?.eventStartDate).format(
          "D MMM, ddd"
        )} around ${formattedStartTime} onwards at ${eventDetails?.address}

Join me using https://play.google.com/store/apps/details?id=com.foodhealers.climatehealers.`,
        url: "https://play.google.com/store/apps/details?id=com.foodhealers.climatehealers",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const expired = moment(eventDetails?.eventEndDate).isBefore(moment());
  const approved = eventDetails?.status === "approved";
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
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
                  <Text style={styles.itemText}>{eventDetails.name}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: expired ? "#bab7b6" : "white",
                    borderRadius: h2dp(1),
                  },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: eventDetails?.eventPhoto }}
                    style={{
                      width: "100%",
                      height: 250,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      opacity: expired ? 0.3 : 1,
                    }}
                  />
                </View>
                <View style={{ marginTop: h2dp(3) }}>
                  <View
                    style={{
                      marginBottom: h2dp(2),
                      paddingHorizontal: w2dp(1),
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("FROM")}:
                      <Text style={styles.cardText}>
                        {" "}
                        {moment(eventDetails?.eventStartDate).format(
                          "ddd, MMM D"
                        )}{" "}
                        {formattedStartTime}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                    <Text style={styles.boldText}>
                      {localized.t("TO")}:{" "}
                      <Text style={styles.cardText}>
                        {moment(eventDetails?.eventEndDate).format(
                          "ddd, MMM D"
                        )}{" "}
                        {formattedEndTime}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                    <Text style={styles.boldText}>
                      {localized.t("LOCATION")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails.address}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp("2%"),
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("WHAT")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails?.additionalInfo}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp("2%"),
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("VOLUNTEERS_REQUIRED")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails?.requiredVolunteers}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PrimaryButton
                    disabled={expired || !approved}
                    title={
                      expired
                        ? `${localized.t("EVENT_EXPIRED")}`
                        : `${localized.t("VOLUNTEER")}`
                    }
                    onPress={() =>
                      navigation.navigate("AddVolunteerToEventScreen", {
                        id: eventDetails.id,
                        title: `${localized.t("VOLUNTEER_AT_EVENT")}`,
                        itemTypeId: 3,
                        longitude: eventDetails.longitude,
                        latitude: eventDetails.latitude,
                        eventStartDate: eventDetails?.eventStartDate,
                        eventEndDate: eventDetails?.eventEndDate,
                      })
                    }
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                  />
                  {!expired && (
                    <View>
                      <TouchableOpacity onPress={onShare}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 20,
                            marginTop: w2dp(5),
                            textDecorationLine: "underline",
                            alignSelf: "center",
                          }}
                        >
                          {localized.t("SHARE")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SingleEventDetails;
