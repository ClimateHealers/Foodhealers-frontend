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
  StyleSheet,
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
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";

const SingleEventDetails = ({ route }: any) => {
  const { eventDetails } = route.params;

  console.log("Event Details", eventDetails);
  const navigation: any = useNavigation();

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
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
        // message: `${eventDetails?.additionalInfo}`,
        message: `Coming soon!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const expired = moment(eventDetails?.eventEndDate).isBefore(moment());
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
          style={styles.background}
        >
          <SafeAreaView>
            <ScrollView>
              <View style={styles.row}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  style={{ marginRight: w2dp(7), marginTop: h2dp(3) }}
                  onPress={() => navigation.goBack()}
                />
                <Text style={styles.itemText}>{"See all events"}</Text>
                <View style={styles.item}>
                  <BurgerIcon />
                  {menuOpen && (
                    <View
                      style={{
                        position: "absolute",
                        right: 60,
                        top: 70,
                        backgroundColor: "white",
                        borderColor: "white",
                        height: 100,
                        borderRadius: 5,
                        zIndex: 9999,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleMenuItemPress("Home")}
                      >
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
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cardContainer}>
                <View
                  style={[
                    styles.card,
                    { backgroundColor: expired ? "#bab7b6" : "white" },
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
                  <View style={styles.cardTextConainer}>
                    <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                      <Text style={styles.boldText}>
                        From:
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
                        To:{" "}
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
                        Location:{" "}
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
                        What:{" "}
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
                        Volunteer's Required:{" "}
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
                  {eventDetails?.itemTypeId === 3 ? (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: h2dp(2),
                      }}
                    >
                      <PrimaryButton
                        disabled={expired}
                        title="Volunteer"
                        // title={"Get directions"}
                        onPress={() =>
                          navigation.navigate("AddVolunteerToEvent", {
                            id: eventDetails.id,
                            title: eventDetails.title,
                            itemTypeId: eventDetails.itemTypeId,
                          })
                        }
                        buttonStyle={styles.buttonStyles}
                        titleStyle={styles.titleStyle}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: h2dp(2),
                      }}
                    >
                      <PrimaryButton
                        disabled={expired}
                        title={expired ? "Event Expired" : "Get directions"}
                        // title={"Get directions"}
                        onPress={navigationHandler}
                        buttonStyle={styles.buttonStyles}
                        titleStyle={styles.titleStyle}
                      />
                      {!expired && (
                        <TouchableOpacity onPress={onShare}>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 20,
                              marginTop: w2dp(5),
                              textDecorationLine: "underline",
                            }}
                          >
                            Share
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
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
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    marginLeft: 30,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginTop: h2dp(3),
  },
  cardContainer: {
    // marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: w2dp("5%"),
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 190,
    marginTop: h2dp("1.5"),
  },
  titleStyle: {
    color: "white",
    fontSize: 26,

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
    fontWeight: "300",
    fontSize: 20,
  },
});

export default SingleEventDetails;
