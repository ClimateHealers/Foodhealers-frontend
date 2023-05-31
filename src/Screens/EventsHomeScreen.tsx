import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { localized } from "../locales/localization";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../Components/PrimaryButton";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authAction";
import { Formik } from "formik";
import * as Yup from "yup";
import { Text } from "react-native";
import { loginSchema } from "../Components/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-elements";

const EventsHomeScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [loading, setLoading] = useState(false);
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

  const dispatch = useDispatch();

  const data = useSelector((state: any) => state.auth.data);
  console.log("checking auth data", data);

  const handlePressOutside = () => {
    setlangOpen(false);
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
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("MapScreen", {
      location: location,
    });
  };

  const [error, setError] = useState("");
  const navigation: string = useNavigation<string>();

  // const handleLogin = () => {
  //   setLoading(true);
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;

  //       console.log("User signed in:", user);
  //       setLoading(false);
  //       console.log("user signed in successfully");

  //       return user.getIdToken();
  //     })
  //     .then(async(token) => {
  //       const data = {
  //         tokenId: token,
  //       };
  //      const response = await dispatch(login(data) as any)
  //      if (response.payload.isAuthenticated) {
  //       navigation.navigate("HomeScreen");
  //     }

  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       setError(errorMessage);
  //     });
  // };

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
                right: 60,
                top: 125,
                backgroundColor: "white",
                borderColor: "white",
                height: 100,
                borderRadius: 5,
                zIndex: 9999,
                // elevation:0
              }}
            >
              <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
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
                onPress={() => findFoodMenuItemPress("Find Food")}
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
                  <TouchableOpacity onPress={()=>navigation.navigate("PostEvent")}>
                  <Text style={styles.textStyle}>Post Event</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Image
                  source={require("../../assets/images/allEvents.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <Text style={styles.textStyle}>See all Event</Text>
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
    top: 72,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textStyle: {
    textAlign: "center",
    fontSize: 26,
    lineHeight: 35,
    fontFamily: "OpenSans-SemiBold",
    fontWeight: "400",
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

// font-family: 'Open Sans';
// font-style: normal;
// font-weight: 400;
// font-size: 26px;
// line-height: 35px;
// text-align: center;
