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
import { Text } from "react-native";
import { loginSchema } from "../Components/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getLocation } from "../Components/getCurrentLocation";
import {
  widthPercentageToDP as w2dp,
  heightPercentageToDP as h2dp,
} from "react-native-responsive-screen";

const LoginScreen = () => {
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
  const [error, setError] = useState("");
  const navigation: any = useNavigation<string>();

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
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    // console.log(`Selected menu item: ${item}`);
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
    });
    setMenuOpen(false);
  };

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
            </View>
          )}
          <View style={styles.dropdownContainer}>
            <SelectDropdown
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={() => {
                return (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={18}
                    color="#B50000"
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              data={lang && lang.map((dd) => dd.label)}
              onSelect={changeLanguage}
              defaultButtonText={"EN"}
              buttonTextAfterSelection={(itemValue, index) => {
                return lang[index].value.toUpperCase();
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
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
          <View style={{ marginTop: 30 }}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={async ({ email, password }) => {
                setLoading(true);
                signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    setLoading(false);
                    console.log("user signed in successfully");
                    navigation.navigate("HomeScreen");
                    return user.getIdToken();
                  })
                  .then((token) => {
                    const data = {
                      tokenId: token,
                    };
                    dispatch(login(data) as any);
                    console.log("Firebase token:", token);
                  })
                  .catch((error) => {
                    setLoading(false);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    errorMessage ? Alert.alert("user not found") : "";
                    setError(errorMessage);
                  });
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={{ marginTop: 100 }}>
                  <TextInput
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email.toLocaleLowerCase()}
                    placeholder={localized.t("Email")}
                    placeholderTextColor={"black"}
                    style={styles.textInput}
                  />
                  <Text style={styles.inputError}>{errors.email}</Text>
                  <TextInput
                    secureTextEntry={showPassword ? false : true}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder={localized.t("Password")}
                    placeholderTextColor={"black"}
                    style={styles.textInput}
                  />
                  <Icon
                    name={"eye"}
                    size={20}
                    color="#A5A5A5"
                    style={styles.icon}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text style={styles.inputError}>{errors.password}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text
                        style={{
                          alignSelf: "flex-end",
                          color: "white",
                          fontSize: 15,
                          // marginTop: 10,
                          textDecorationLine: "underline",
                        }}
                      >
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
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
                      title={localized.t("Sign in")}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                      onPress={handleSubmit}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: h2dp("20"),
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 18,
                        marginTop: 10,
                      }}
                    >
                      Not a user?
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("SignupScreen")}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          textDecorationLine: "underline",
                          fontFamily: "OpenSans-Bold",
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      >
                        {`${" "}${localized.t("Sign up")}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
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
    padding: 16,
  },
  input: {
    height: 50,
    marginBottom: 10,
    background: "#FFFFFF",
    borderRadius: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },
  dropdown1BtnStyle: {
    marginTop: 15,
    width: "22%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdown1BtnTxtStyle: { color: "#B50000", textAlign: "left", fontSize: 14 },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    color: "black",
    borderRadius: 4,
    height: 180,
    fontSize: 14,
    borderColor: "blue",
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    color: "#B50000",
    borderBottomColor: "#D1D1D6",
    borderRadius: 5,
  },
  dropdown1RowTxtStyle: { color: "black", textAlign: "center", fontSize: 10 },
  inputError: {
    color: "red",
    marginBottom: 10,
  },
  textInput: {
    height: 45,
    marginBottom: 1,
    backgroundColor: "white",
  },
  icon: {
    position: "absolute",
    top: 85,
    left: 300,
  },
});

export default LoginScreen;
