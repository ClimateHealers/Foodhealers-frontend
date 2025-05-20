import { Entypo, Ionicons } from "@expo/vector-icons";
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
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import PrimaryButton from "../Components/PrimaryButton";
import { signupSchema } from "../Components/validation";
import { auth } from "../firebase/firebaseConfig";
import { localized } from "../locales/localization";
import {
  login,
  registerUser,
  updateExpoPushToken,
} from "../redux/actions/authAction";
import * as Notifications from "expo-notifications";
import BurgerIcon from "../Components/BurgerIcon";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

const SignupScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const getExpoPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.manifest?.extra?.eas?.projectID,
      });
      setExpoPushToken(token?.data);
    };
    getExpoPushToken();
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <StatusBar animated backgroundColor="auto" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Ionicons
              name="chevron-back"
              size={hp(3.5)}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>{localized.t("SIGN_UP")}</Text>
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
                    <ActivityIndicator size="large" />
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
                onSubmit={async ({ email, password, name }) => {
                  setLoading(true);
                  try {
                    const userCredential = await createUserWithEmailAndPassword(
                      auth,
                      email,
                      password
                    );
                    const token = await userCredential.user.getIdToken();
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
                  } catch (error) {
                    const { code } = error;
                    if (code === "auth/email-already-in-use") {
                      Alert.alert(
                        localized.t("EMAIL_ALREADY_IN_USE"),
                        localized.t("PLEASE_USE_DIFF.")
                      );
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => {
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
                    <View style={styles.formContainer}>
                      <TextInput
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        placeholder={localized.t("NAME")}
                        placeholderTextColor="black"
                        style={styles.textInput}
                      />
                      <Text style={styles.inputError}>{errors.name}</Text>
                      <TextInput
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email.toLocaleLowerCase()}
                        placeholder={localized.t("EMAIL")}
                        placeholderTextColor="black"
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
                          placeholderTextColor="black"
                          style={styles.textInput}
                        />
                        <Icon
                          name="eye"
                          size={hp(2.2)}
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
                            size={hp(2.2)}
                            color={test ? "#FFFF" : "#ff6e75"}
                            style={{ marginRight: wp(2) }}
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

                      <View style={styles.buttonWrapper}>
                        <PrimaryButton
                          title={localized.t("SIGN_UP")}
                          buttonStyle={styles.buttonStyles}
                          titleStyle={styles.titleStyle}
                          onPress={handleSubmit}
                        />
                      </View>

                      <View style={styles.footerTextWrapper}>
                        <Text style={styles.footerText}>
                          {localized.t("ALREADY_HAVE_A_ACCOUNT")}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("LoginScreen")}
                        >
                          <Text style={styles.footerLink}>
                            {localized.t("SIGN_IN")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginTop: hp(1),
  },
  title: {
    fontSize: h2dp(2.5),
    color: "white",
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  formContainer: { width: "100%" },
  textInput: {
    height: hp(6),
    marginBottom: hp(1),
    backgroundColor: "white",
  },
  inputError: {
    color: "#ff6e75",
    marginBottom: hp(0.5),
  },
  icon: {
    position: "absolute",
    right: wp(4),
    top: hp(1.5),
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  buttonWrapper: {
    backgroundColor: "#FC5A56",
    borderRadius: w2dp(2),
    marginTop: h2dp(3),
    marginHorizontal: h2dp(3),
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    borderRadius: wp(2),
  },
  titleStyle: {
    color: "white",
    fontSize: h2dp(2.2),
    fontWeight: "bold",
  },
  footerTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(4),
  },
  footerText: {
    color: "white",
    fontSize: hp(1.8),
  },
  footerLink: {
    color: "white",
    fontSize: hp(1.8),
    textDecorationLine: "underline",
    fontFamily: "OpenSans-Bold",
    marginLeft: wp(1),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: wp(5),
    padding: wp(8),
    alignItems: "center",
  },
});

export default SignupScreen;
