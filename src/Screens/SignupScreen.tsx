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
import { createUserWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { login, registerUser } from "../redux/actions/authAction";
import { signupSchema } from "../Components/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignupScreen = () => {
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
  const navigation: any = useNavigation();

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
    // navigation.navigate("MapScreen");
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
                  style = {{
                    marginRight:20
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
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signupSchema}
            onSubmit={async ({ email , password, name }:any) => {
              console.log("dfbsidjbslkdn");
              setLoading(true);
              createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  // console.log("User signed in:", user);
                  setLoading(false);

                  return user.getIdToken();
                })
                .then(async (token) => {
                  const data = {
                    tokenId: token,
                    name: name,
                    email: email,
                    isVolunteer: true,
                  };
                  console.log("signup Firebase token:", data.tokenId);

                  const response = await dispatch(registerUser(data) as any);
                  console.log("zzzzzzzzzzzzzzzzz", response.payload);
                  if (response.payload.success) {
                    const loginResponse = await dispatch(login(data) as any);
                    console.log("cccccccccccccccccc", loginResponse?.payload);
                    if (loginResponse?.payload?.isAuthenticated) {
                      navigation.navigate("HomeScreen", {
                        data: loginResponse?.payload?.user,
                      });
                    }
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.error("Error signing in:", errorCode, errorMessage);
                  if (errorCode === "auth/invalid-email") {
                    Alert.alert(
                      "Invalid Credentials",
                      "Email not valid",
                      [
                        {
                          text: "Ok",
                          style: "cancel",
                        },
                      ],
                      { cancelable: true }
                    );
                  }
                });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }:any) => (
              <View style={{ marginTop: 100 }}>
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder={localized.t("Name")}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors.name}</Text>
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
                <Icon
                  name={"eye"}
                  size={20}
                  color="#A5A5A5"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eye}
                />

                <Text style={styles.inputError}>{errors.password}</Text>
                <TextInput
                  secureTextEntry={showConfirmPassword ? false : true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder={localized.t("Confirm password")}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors.confirmPassword}</Text>

                <PrimaryButton
                  title={localized.t("Sign up")}
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
    justifyContent: "center",
    padding: 16,
    // marginBottom: 200,
  },
  input: {
    height: 50,
    marginBottom: 16,
    background: "#FFFFFF",
    borderRadius: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
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
    marginTop: 130,
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
    // position: "absolute",
    // top: "10%",
    // left: "5%",
    // width: "70%",
    display:"flex",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems:'center'
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
  },
  icon: {
    position: "absolute",
    top: 152,
    left: 300,
  },
  eye: {
    position: "absolute",
    top: 222,
    left: 300,
    zIndex: 9999,
  },
});

export default SignupScreen;
