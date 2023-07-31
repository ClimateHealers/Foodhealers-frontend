import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { removeAuthData } from "../redux/actions/authAction";
import { logOut } from "../redux/reducers/authreducers";

const EventsHomeScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "Bengali", value: "be" },
    { id: 2, label: "Chinese", value: "ch" },
    { id: 3, label: "English", value: "en" },
    { id: 4, label: "French", value: "fr" },
    { id: 5, label: "Hindi", value: "hi" },
    { id: 6, label: "Mandarin", value: "ma" },
    { id: 7, label: "Punjabi", value: "pu" },
    { id: 8, label: "Spanish", value: "es" },
  ]);

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const dispatch = useDispatch();

  const data = useSelector((state: any) => state.auth.data);

  const handlePressOutside = () => {
    setlangOpen(false);
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
    getLocation()?.then((location: any) => {
    if(location){
      navigation?.navigate("MapScreen", {
        location: location,
      });
    }
    });
    setMenuOpen(false);
  };

  const navigation: any = useNavigation<string>();

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <View style={styles.container}>
          <StatusBar animated={true} backgroundColor="auto" />
          {menuOpen && (
            <View
              style={{
                position: "absolute",
                right: 55,
                top: 135,
                backgroundColor: "white",
                borderColor: "white",

                borderRadius: 5,
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
                <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                   Account
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.dropdownContainer}>
            <View style={styles.item}>
              <Text style={styles.itemText}>Home</Text>
            </View>
            <MaterialCommunityIcons
              name="menu"
              size={40}
              color="white"
              onPress={toggleMenu}
              style={{
                marginRight: 20,
              }}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.centeredView}>
              <View>
                <Image
                  source={require("../../assets/images/shutterShock.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PostEvent")}
                  >
                    <Text style={styles.textStyle}>Post an event</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Image
                  source={require("../../assets/images/allEvents.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AllEventScreen")}
                  >
                    <Text style={styles.textStyle}>See all events</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },

  background: {
    flex: 1,
    resizeMode: "cover",
  },
  titleStyle: {
    color: "black",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 60,
  },
  textInput: {
    height: 45,
    marginBottom: 1,
  },
  item: {
    width: "30%",
    marginRight: 55,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  imageStyle: {
    width: "100%",
    height: "65%",
    borderRadius: 10,
  },
  title: {
    backgroundColor: "white",
    opacity: 0.9,
    width: "100%",
    height: "20%",
    position: "absolute",
    top: h2dp("9.2"),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textStyle: {
    textAlign: "center",
    fontSize: 26,
    lineHeight: 35,
    fontWeight: "normal",
    fontStyle: "normal",
    marginTop: 15,
  },
  centeredView: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 70,
  },
});

export default EventsHomeScreen;
