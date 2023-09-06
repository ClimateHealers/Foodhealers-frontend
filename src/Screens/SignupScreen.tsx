import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { Text, TextInput } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import { signupSchema } from "../Components/validation";
import { auth } from "../firebase/firebaseConfig";
import { localized } from "../locales/localization";
import { login, registerUser } from "../redux/actions/authAction";
import { setLanguage } from "../redux/reducers/langReducer";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";

const SignupScreen = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [expoPushToken, setExpoPushToken] = useState<any>("")
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
useEffect(()=>{
  const getExpoPushToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId : Constants?.manifest?.extra?.eas?.projectID
    });
    const tokenKey = token?.data.substring(token?.data.indexOf('[') + 1, token?.data.indexOf(']'));
    setExpoPushToken(token?.data);
    // sendPushNotification(token);
  };
  getExpoPushToken()
},[])
  




  const dispatch = useDispatch();
  const languageName = useSelector((state:any) => state.language)

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage))
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if(res){
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <ScrollView>
        <View style={styles.container}>
          <StatusBar animated={true} backgroundColor="auto" />
          {menuOpen && (
            <View
              style={{
                position: "absolute",
                right: 60,
                top: Platform.OS === "ios" ? h2dp(12.5) : h2dp(9),
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
              // defaultButtonText={"EN"}
              defaultButtonText={languageName.toUpperCase()}
              buttonTextAfterSelection={(itemValue, index) => {
                return languageName.toUpperCase();
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
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signupSchema}
            onSubmit={async ({ email, password, name }: any) => {
              setLoading(true);
              createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  const user = userCredential.user;
                  setLoading(false);

                  return user.getIdToken();
                })
                .then(async (token) => {
                  const data = {
                    tokenId: token,
                    name: name,
                    email: email,
                    isVolunteer: true,
                    expoPushToken: expoPushToken
                  };

                  const response = await dispatch(registerUser(data) as any);
                  if (response.payload.success) {
                    const loginResponse = await dispatch(login(data) as any);
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
                  if (errorCode === "auth/email-already-in-use") {
                    Alert.alert(
                      "Email already in use",
                      "Please use a different email or sign in instead.",
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
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
            }: any) => (
              <View style={{ marginTop: h2dp(12) }}>
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
                <View style = {{position:"relative"}}>
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
                </View>
            

                <Text style={styles.inputError}>{errors.password}</Text>
                <View style = {{position:"relative"}}>
                <TextInput
                  secureTextEntry={showConfirmPassword ? false : true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder={localized.t("Confirm password")}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                    <Icon
                  name={"eye"}
                  size={20}
                  color="#A5A5A5"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eye}
                />
                </View>
                <Text style={styles.inputError}>{errors.confirmPassword}</Text>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: h2dp("5"),
                  }}
                >
                  <PrimaryButton
                    title={localized.t("Sign up")}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                    onPress={handleSubmit}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 18,
                    marginTop: h2dp(9),
                  }}
                >
                  Already have an account ?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
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
                    {localized.t("Sign in")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
        </ScrollView>
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
    marginBottom: 16,
    background: "#FFFFFF",
    borderRadius: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    // marginTop: 70,
    // marginLeft: 75,
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
    marginTop: 40,
    position:"relative"
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
    top: h2dp(1.5),
    left: w2dp("80%"),
  },
  eye: {
    position: "absolute",
    top: h2dp(1.5),
    left: w2dp("80%"),
    zIndex: 9999,
  },
});

export default SignupScreen;
