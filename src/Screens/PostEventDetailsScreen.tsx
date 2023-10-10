import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";

const PostEventDetailsScreen = ({ route }: any) => {
  const { eventDetails, eventPhotos } = route.params;
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
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
    });
    setMenuOpen(false);
  };

  const epochDate = eventDetails?.eventDate;
  const dateObj = new Date(epochDate * 1000);

  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
  };

  const formattedDate = dateObj.toLocaleDateString("en-US", options);

  const epochEndDate = eventDetails?.eventEndDateTime;
  const endDateObj = new Date(epochEndDate * 1000);

  const formattedEndDate = dateObj.toLocaleDateString("en-US", options);

  const epochTime = eventDetails?.eventDate;
  const startTime = moment(epochTime * 1000).format("h:mm a");
  const formattedTime = `${startTime}`;

  const epochEndTime = eventDetails?.eventEndDateTime;

  const endTime = moment(epochEndTime * 1000).format("h:mm a");
  const formattedEndTime = `${endTime}`;

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#012e17", "#017439", "#009b4d"]}
          style={styles.background}
        >
          <ScrollView>
            <SafeAreaView>
              <View style={styles.row}>
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("POST_AN_EVENT")}
                  </Text>
                </View>
                <View style={styles.item}>
                  <MaterialCommunityIcons
                    name="menu"
                    size={40}
                    color="white"
                    onPress={toggleMenu}
                    style={{ marginLeft: 30 }}
                  />
                  {menuOpen && (
                    <View
                      style={{
                        position: "absolute",
                        right: 60,
                        top: 70,
                        backgroundColor: "white",
                        borderColor: "white",
                        borderRadius: 5,
                        height: 100,
                        width: 100,
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
                          {localized.t("HOME")}
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
                          {localized.t("FIND_FOOD")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <View>
                    <Image
                      source={{ uri: eventPhotos[0] }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  </View>
                  <View style={styles.cardTextConainer}>
                    <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                      <Text style={styles.boldText}>
                        {localized.t("DATE")}:{" "}
                        <Text style={styles.cardText}>
                          {formattedDate} - {formattedEndDate}
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
                        {localized.t("TIME")}:{" "}
                        <Text style={styles.cardText}>
                          {formattedTime}- {formattedEndTime}
                        </Text>
                      </Text>

                      <Divider
                        style={{
                          backgroundColor: "black",
                          height: 1,
                          width: "95%",
                          marginLeft: 2,
                        }}
                      />
                    </View>
                    <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                      <Text style={styles.boldText}>
                        {localized.t("LOCATION")}:{" "}
                        <Text style={styles.cardText}>
                          {eventDetails?.address}
                        </Text>
                      </Text>
                      <Divider
                        style={{
                          backgroundColor: "black",
                          height: 1,
                          width: "95%",
                          marginLeft: 2,
                        }}
                      />
                    </View>
                    <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                      <Text style={styles.boldText}>
                        {localized.t("WHAT")}:{" "}
                        <Text style={styles.cardText}>
                          {eventDetails?.served}
                        </Text>
                      </Text>

                      <Divider
                        style={{
                          backgroundColor: "black",
                          height: 1,
                          width: "95%",
                          marginLeft: 2,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: h2dp("5"),
                }}
              >
                <PrimaryButton
                  title={localized.t("SEE_ALL_EVENTS")}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={() => navigation.navigate("AllEventScreen")}
                />
              </View>
            </SafeAreaView>
          </ScrollView>
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
  },
  item: {
    width: "40%",
    marginTop: 25,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  cardContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
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

export default PostEventDetailsScreen;
