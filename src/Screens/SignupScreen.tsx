import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import {
  login,
  registerUser,
  updateExpoPushToken,
} from "../redux/actions/authAction";
import { setLanguage } from "../redux/reducers/langReducer";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const SignupScreen = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [expoPushToken, setExpoPushToken] = useState<any>("");
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

  useEffect(() => {
    const getExpoPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.manifest?.extra?.eas?.projectID,
      });
      const tokenKey = token?.data.substring(
        token?.data.indexOf("[") + 1,
        token?.data.indexOf("]")
      );
      setExpoPushToken(token?.data);
    };
    getExpoPushToken();
  }, []);

  const dispatch = useDispatch();
  const languageName = useSelector((state: any) => state.language);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(false);
  };
  const navigation: any = useNavigation();

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage));
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
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <ScrollView>
          <View style={styles.container}>
            <StatusBar animated={true} backgroundColor="auto" />
            {menuOpen && (
              <View
                style={{
                  position: "absolute",
                  right: w2dp(8.5),
                  top: Platform.OS === "ios" ? h2dp(12.5) : h2dp(9),
                  backgroundColor: "white",
                  borderColor: "white",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  zIndex: 1,
                }}
              >
                <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: h2dp(2.0),
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
                      fontSize: h2dp(2.0),
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    {localized.t("FIND_FOOD")}
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
                defaultButtonText={languageName.toUpperCase()}
                buttonTextAfterSelection={(itemValue: any, index: any) => {
                  return languageName.toUpperCase();
                }}
                rowTextForSelection={(item: any, index: any) => {
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
                      expoPushToken: expoPushToken,
                    };
                    const response = await dispatch(registerUser(data) as any);
                    if (response.payload.success) {
                      const loginResponse = await dispatch(login(data) as any);
                      if (loginResponse?.payload?.isAuthenticated) {
                        const getExpoPushToken = async () => {
                          const token =
                            await Notifications.getExpoPushTokenAsync({
                              projectId:
                                Constants?.manifest?.extra?.eas?.projectID,
                            });
                          const data = {
                            expoPushToken: token?.data,
                          };
                          dispatch(updateExpoPushToken(data) as any).then(
                            (res: any) => {
                              if (!res?.payload?.success) {
                                Alert.alert(
                                  `${localized.t("ALERT")}`,
                                  "Failed to generate push token",
                                  [
                                    {
                                      text: `${localized.t("CANCEL")}`,
                                      onPress: () => {},
                                      style: "cancel",
                                    },
                                  ],
                                  { cancelable: true }
                                );
                              } else {
                                console.log("Success");
                              }
                            }
                          );
                        };
                        getExpoPushToken();
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
                        `${localized.t("EMAIL_ALREADY_IN_USE")}`,
                        `${localized.t("PLEASE_USE_DIFF.")}`,
                        [
                          {
                            text: `${localized.t("OK")}`,
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
              }: any) => {
                const passwordRules = [
                  {
                    key: "PASSWORD_MUST_HAVE_SMALL",
                    test: /[a-z]/.test(values.password),
                  },
                  {
                    key: "PASSWORD_MUST_HAVE_CAPS",
                    test: /[A-Z]/.test(values.password),
                  },
                  {
                    key: "PASSWORD_MUST_HAVE_NUMBERS",
                    test: /[0-9]/.test(values.password),
                  },
                  {
                    key: "PASSWORD_MUST_HAVE_CHAR",
                    test: /[^A-Za-z0-9]/.test(values.password),
                  },
                  {
                    key: "PASSWORD_MUST_BE_LEAST",
                    test: values.password.length >= 6,
                  },
                ];
                return (
                  <View style={{ gap: h2dp(5) }}>
                    <Text style={styles.heading}>{localized.t("SIGN_UP")}</Text>
                    <View>
                      <TextInput
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        placeholder={localized.t("NAME")}
                        placeholderTextColor={"black"}
                        style={styles.textInput}
                      />
                      <Text style={styles.inputError}>{errors.name}</Text>
                      <TextInput
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email.toLocaleLowerCase()}
                        placeholder={localized.t("EMAIL")}
                        placeholderTextColor={"black"}
                        style={styles.textInput}
                      />
                      <Text style={styles.inputError}>{errors.email}</Text>
                      <View style={{ position: "relative" }}>
                        <TextInput
                          secureTextEntry={showPassword ? false : true}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder={localized.t("PASSWORD")}
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
                      {passwordRules.map(({ key, test }) => (
                        <View style={styles.ruleRow} key={key}>
                          <Entypo
                            name={test ? "check" : "cross"}
                            size={20}
                            color={test ? "#FFFF" : "#ff6e75"}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            style={[
                              styles.inputError,
                              { color: test ? "#FFFF" : "#ff6e75" },
                            ]}
                          >
                            {localized.t(key)}
                          </Text>
                        </View>
                      ))}

                      {/* <View style={{ position: "relative" }}>
                      <TextInput
                        secureTextEntry={showConfirmPassword ? false : true}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        placeholder={localized.t("CONFIRM_PASSWORD")}
                        placeholderTextColor={"black"}
                        style={styles.textInput}
                      />
                      <Icon
                        name={"eye"}
                        size={20}
                        color="#A5A5A5"
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={styles.eye}
                      />
                    </View>
                    <Text style={styles.inputError}>
                      {errors.confirmPassword}
                    </Text> */}
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: h2dp(5),
                        }}
                      >
                        <PrimaryButton
                          title={localized.t("SIGN_UP")}
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
                          marginTop: h2dp(5),
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: h2dp(1.8),
                          }}
                        >
                          {localized.t("ALREADY_HAVE_A_ACCOUNT")}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("LoginScreen")}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: h2dp(1.8),
                              textDecorationLine: "underline",
                              fontFamily: "OpenSans-Bold",
                              textAlign: "center",
                            }}
                          >
                            {localized.t("SIGN_IN")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: w2dp("4%"),
  },
  input: {
    height: h2dp("6%"),
    marginBottom: h2dp("2%"),
    backgroundColor: "#FFFFFF",
    borderRadius: h2dp("1%"),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: h2dp("2%"),
  },
  modalView: {
    margin: w2dp("5%"),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: w2dp("5%"),
    padding: w2dp("8%"),
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
    borderRadius: w2dp("2%"),
    width: w2dp("50%"),
  },
  titleStyle: {
    color: "white",
    fontSize: h2dp(2.6),
    fontWeight: "400",
    lineHeight: h2dp("4.5%"),
    fontFamily: "OpenSans-Regular",
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: h2dp("5%"),
    position: "relative",
  },
  dropdown1BtnStyle: {
    marginTop: h2dp("2%"),
    width: w2dp("22%"),
    height: h2dp("6%"),
    backgroundColor: "#FFF",
    borderRadius: w2dp("2%"),
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdown1BtnTxtStyle: {
    color: "#B50000",
    textAlign: "left",
    fontSize: h2dp(1.4),
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: h2dp("1%"),
    height: h2dp("22%"),
    fontSize: h2dp(1.4),
    borderColor: "blue",
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    color: "#B50000",
    borderBottomColor: "#D1D1D6",
    borderRadius: w2dp("1%"),
  },
  dropdown1RowTxtStyle: {
    color: "black",
    textAlign: "center",
    fontSize: h2dp("1%"),
  },
  inputError: {
    color: "#ff6e75",
    marginBottom: h2dp(0.5),
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: h2dp(3.5),
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
  textInput: {
    height: h2dp("6%"),
    marginBottom: h2dp("1%"),
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
