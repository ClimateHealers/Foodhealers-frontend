import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../Components/PrimaryButton";
import { loginSchema } from "../Components/validation";
import { auth } from "../firebase/firebaseConfig";
import { localized } from "../locales/localization";
import {
  getExpoPushToken,
  login,
  updateExpoPushToken,
} from "../redux/actions/authAction";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import BurgerIcon from "../Components/BurgerIcon";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

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

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <StatusBar backgroundColor="auto" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                handlePressOutside();
              }}
            >
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>{localized.t("LOGIN")}</Text>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Modal visible={loading} animationType="slide" transparent>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size="large" color="white" />
                  </View>
                </View>
              </Modal>

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
                      const user = userCredential.user;
                      setLoading(false);
                      console.log("user signed in successfully");

                      return user.getIdToken();
                    })
                    .then((token) => {
                      const data = {
                        tokenId: token,
                        expoPushToken: expoPushToken,
                      };
                      dispatch(login(data) as any).then((res: any) => {
                        if (!res?.payload?.success) {
                          Alert.alert(
                            `${localized.t("ACCOUNT_DOES_NOT_EXIST")}`,
                            `${localized.t("PLEASE_SIGN_UP")}`,
                            [
                              {
                                text: `${localized.t("CANCEL")}`,
                                onPress: () => {},
                                style: "cancel",
                              },
                              {
                                text: `${localized.t("SIGN_UP")}`,
                                onPress: () => {
                                  navigation.navigate("SignupScreen");
                                },
                                style: "cancel",
                              },
                            ],
                            { cancelable: true }
                          );
                        } else {
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
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{ name: "HomeScreen" }],
                            })
                          );
                        }
                      });
                    })
                    .catch((error) => {
                      setLoading(false);
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      errorMessage
                        ? Alert.alert(
                            `${localized.t("INVALID_CREDENTIALS")}`,
                            `${localized.t("INCORRECT_EMAIL_OR_PASSWORD")}`,
                            [
                              {
                                text: `${localized.t("OK")}`,
                                style: "cancel",
                              },
                            ],
                            { cancelable: true }
                          )
                        : "";
                      setError(errorMessage);
                    });
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => (
                  <View style={styles.formContainer}>
                    <TextInput
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={localized.t("EMAIL")}
                      placeholderTextColor="black"
                      style={styles.input}
                    />
                    <Text style={styles.inputError}>{errors.email}</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        secureTextEntry={!showPassword}
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        placeholder={localized.t("PASSWORD")}
                        placeholderTextColor="black"
                        style={styles.input}
                      />
                      <Icon
                        name="eye"
                        size={20}
                        color="#A5A5A5"
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    </View>
                    <Text style={styles.inputError}>{errors.password}</Text>

                    <TouchableOpacity
                      style={styles.forgotPassword}
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text style={styles.link}>
                        {localized.t("FORGOT_PASSWORD")}
                      </Text>
                    </TouchableOpacity>

                    <PrimaryButton
                      title={localized.t("SIGN_IN")}
                      buttonStyle={styles.button}
                      titleStyle={styles.buttonTitle}
                      onPress={handleSubmit}
                    />

                    <View style={styles.signupContainer}>
                      <Text style={styles.signupText}>
                        {localized.t("NOT_AN_USER")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          handlePressOutside();
                          navigation.navigate("SignupScreen");
                        }}
                      >
                        <Text style={styles.link}>
                          {localized.t("SIGN_UP")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: w2dp(4),
    marginTop: h2dp(1),
  },
  title: {
    fontSize: h2dp(2.5),
    color: "white",
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: w2dp(4),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    height: h2dp(6),
    marginBottom: h2dp(1),
    paddingHorizontal: w2dp(2),
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    top: h2dp(2),
    right: w2dp(4),
  },
  inputError: {
    color: "#ff6e60",
    fontSize: h2dp(1.5),
    marginBottom: h2dp(1),
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: h2dp(2),
  },
  link: {
    color: "white",
    textDecorationLine: "underline",
    fontFamily: "OpenSans-Bold",
    fontSize: h2dp(1.8),
  },
  button: {
    backgroundColor: "#FC5A56",
    borderRadius: w2dp(2),
    marginTop: h2dp(3),
    marginHorizontal: h2dp(3),
  },
  buttonTitle: {
    color: "white",
    fontSize: h2dp(2.2),
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: h2dp(4),
  },
  signupText: {
    color: "white",
    fontSize: h2dp(1.8),
  },
});

export default LoginScreen;
