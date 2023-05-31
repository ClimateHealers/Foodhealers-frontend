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
import { TextInput, Text } from "react-native-paper";
import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { localized } from "../locales/localization";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../Components/PrimaryButton";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { loadFonts } from "../font";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { login, registerUser } from "../redux/actions/authAction";
import { signupSchema } from "../Components/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PostEvent = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
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

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: string = useNavigation();

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
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
    navigation.navigate("MapScreen");
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
                top: 145,
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
              <Text style={styles.itemText}>Post an Event</Text>
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
          <Modal visible={loading} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size={"large"} />
              </View>
            </View>
          </Modal>
       
          <Formik
            initialValues={{
              eventName:"",
              address: "",
              addressCont:"",
              date:"",
              time: "",
              served:""
            }}
            validationSchema={signupSchema}
            onSubmit={async ({ eventName, address, addressCont, date,time, served }) => {
             
              setLoading(true);
              
             
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={{ marginTop: 30 }}>
                <TextInput
                  onChangeText={handleChange("eventname")}
                  onBlur={handleBlur("eventName")}
                  value={values.eventName}
                  // placeholder={localized.t("Email")}
                  placeholder={"Event name"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors.eventName}</Text>
                <TextInput
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  value={values.address}
                  // placeholder={localized.t("Address")}
                  placeholder={"Address"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />

                <Text style={styles.inputError}>{errors.address}</Text>
                <TextInput
                  onChangeText={handleChange("addressCont")}
                  onBlur={handleBlur("addressCont")}
                  value={values.password}
                  // placeholder={localized.t("Password")}
                  placeholder={"Address cont."}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />

                <Text style={styles.inputError}>{errors.addressCont}</Text>
                <TextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  // placeholder={localized.t("Password")}
                  placeholder={"Date"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />

                <Text style={styles.inputError}>{errors.date}</Text>
                <TextInput
                  onChangeText={handleChange("time")}
                  onBlur={handleBlur("time")}
                  value={values.time}
                  // placeholder={localized.t("Password")}
                  placeholder={"Time"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />

                <Text style={styles.inputError}>{errors.time}</Text>
                <TextInput
                  onChangeText={handleChange("served")}
                  onBlur={handleBlur("served")}
                  value={values.served}
                  // placeholder={localized.t("Password")}
                  placeholder={"What's being served"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />

                <Text style={styles.inputError}>{errors.served}</Text>

                <PrimaryButton
                  // title={localized.t("Sign in")}
                  title={"Submit"}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    // justifyContent: 'center',
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
    // marginBottom: 150,
    marginTop: 50,
    marginLeft: 75,
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
    marginTop: 30,
    borderColor: "red",
  },
  inputError: {
    color: "red",
    marginBottom: 10,
  },

  textInput: {
    height: 45,
    marginBottom: 1,
  },

  item: {
    marginRight: 55,
    height: 100,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
});

export default PostEvent;
