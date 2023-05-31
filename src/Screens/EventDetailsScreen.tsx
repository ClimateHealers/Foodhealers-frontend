import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Callout, Marker } from "react-native-maps";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { loadFonts } from "../font";
import { localized } from "../locales/localization";
import PrimaryButton from "../Components/PrimaryButton";
import { Divider } from "react-native-paper";
import moment from "moment";

const EventDetailsScreen = ({route}:any) => {
  const { eventDetails } = route.params
  console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvv", eventDetails)
  const { width, height } = Dimensions.get("window");
  const navigation: string = useNavigation();

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
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#012e17", "#017439", "#009b4d"]}
          style={styles.background}
        >
          <SafeAreaView>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.itemText}>{localized.t("Find Food")}</Text>
              </View>
              <View style={styles.item}>
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="white"
                  onPress={toggleMenu}
                />
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
                          fontWeight: 300,
                          lineHeight: 27.24,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Find Food")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: 300,
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
              <View style={styles.card}>
                <View>
                  <Image
                    source={require("../../assets/images/hostingEvent.png")}
                    style={{
                      width: "100%",
                      height: 200,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  />
                </View>
                <View style={styles.cardTextConainer}>
                  <View style={{ marginBottom: 30 }}>
                    <Text style={styles.cardText}>
                    <Text style={styles.boldText}>Today:</Text> {`${moment(eventDetails?.eventStartDate).format("YYYY-MM-DD")} - ${moment(eventDetails?.eventEndDate).format("YYYY-MM-DD")}` }
                    </Text>
                    {/* <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }} /> */}
                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                        marginLeft: 6,
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 30 }}>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Time:</Text>  {`${moment(eventDetails?.eventStartDate).format("HH:mm")} - ${moment(eventDetails?.eventEndDate).format("HH:mm")}` }
                    </Text>
                    {/* <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }} /> */}
                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                        marginLeft: 6,
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 30 }}>
                    <Text style={styles.cardText}>
                    <Text style={styles.boldText}>Location:</Text> {eventDetails.address?.fullAddress}
                    </Text>
                    {/* <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }} /> */}
                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                        marginLeft: 6,
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 30 }}>
                    <Text style={styles.cardText}> <Text style={styles.boldText}>What:</Text> {eventDetails?.additionalInfo}</Text>
                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                        marginLeft: 6,
                      }}
                    />
                  </View>
                </View>
              </View>
              <PrimaryButton
                title={"Get directions"}
                buttonStyle={styles.buttonStyles}
                titleStyle = {styles.titleStyle}
              />
            </View>
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
  },
  cardContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    height: "75%",
    marginLeft: 20,
    borderRadius: 10,
    marginBottom:15
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
    marginTop: 20,
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
    fontFamily:"OpenSans-Light"
  },
  boldText: {
    fontWeight: 'bold',
    // other styles for the bold text
  },
});

export default EventDetailsScreen;
