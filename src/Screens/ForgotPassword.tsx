import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import * as yup from "yup";
import { auth } from "../firebase/firebaseConfig";
import { localized } from "../locales/localization";
import Spinner from "react-native-loading-spinner-overlay/lib";

const forgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(`${localized.t("PLEASE_ENTER_YOUR_EMAIL")}`)
    .required(`${localized.t("EMAIL_IS_REQUIRED")}`),
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [response, setReponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const navigation: any = useNavigation();
  const hideDialog = () => {
    setReponse({
      loading: false,
      error: false,
      message: "",
    });
  };
  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView>
        <ScrollView style={styles.scrollViewContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: 400,
            }}
          >
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 30 }}
            >
              <Ionicons
                name="chevron-back"
                size={30}
                color="white"
                style={{ marginLeft: 1 }}
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.header}>
                {" "}
                {localized.t("FORGOT_PASSWORD")}{" "}
              </Text>
            </View>
            <View style={styles.container2}>
              <Text style={styles.lineText}>
                {localized.t("ENTER_YOUR_EMAIL")}
              </Text>

              <Formik
                validationSchema={forgotPasswordValidationSchema}
                initialValues={{
                  email: "",
                }}
                onSubmit={async ({ email }) => {
                  setLoading(true);
                  try {
                    setReponse({
                      loading: true,
                      message: "",
                      error: false,
                    });
                    const res = await sendPasswordResetEmail(
                      auth,
                      email.toLowerCase()
                    );
                    setReponse({
                      loading: false,
                      message: "Reset link sent successfully",
                      error: false,
                    });
                    setLoading(false);
                    Alert.alert(
                      `${localized.t("RESET_LINK_SENT_SUCCESSFULLY")}`,
                      `${localized.t("WE_HAVE_SUCCESSFULLY_SENT_THE_RESET_LINK_TO_THE_REGISTERED_EMAIL")}`,
                      [
                        {
                          text: `${localized.t("OK")}`,
                          onPress: () => navigation.navigate("LoginScreen"),
                        },
                      ],
                      { cancelable: false }
                    );
                  } catch (err: any) {
                    setLoading(false);
                    setReponse({
                      loading: false,
                      message: err.message,
                      error: true,
                    });
                    Alert.alert(
                      `${localized.t("EMAIL_NOT_FOUND")}`,
                      `${err.message}`,
                      [{ text: `${localized.t("OK")}` }],
                      { cancelable: false }
                    );
                  }
                }}
              >
                {({
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  handleChange,
                  values,
                  errors,
                  touched,
                  isValid,
                }) => {
                  return (
                    <>
                      <TextInput
                        style={styles.textInput}
                        placeholder={localized.t("EMAIL")}
                        placeholderTextColor="white"
                        onChangeText={(values) => {
                          setFieldValue("email", values);
                        }}
                        onBlur={handleBlur("email")}
                        autoCapitalize="none"
                        value={values.email}
                      />
                      {errors.email && touched.email && (
                        <Text style={{ color: "red", marginBottom: 0 }}>
                          {errors.email}
                        </Text>
                      )}
                      <Spinner
                        visible={loading}
                        cancelable={false}
                        textStyle={{
                          color: "white",
                        }}
                      />
                      <TouchableOpacity
                        disabled={!isValid}
                        onPress={() => handleSubmit}
                        style={[
                          styles.regBtn,
                          !isValid && styles.regBtnDisabled,
                        ]}
                      >
                        <Text style={styles.regText}>
                          {localized.t("SEND_RESET_LINK")}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                }}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  textInput: {
    height: 55,
    marginBottom: 1,
    fontSize: 15,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "white",
    color: "white",
  },
  scrollViewContainer: {
    padding: 16,
  },
  container2: {
    // marginTop: 100,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  lineText: {
    marginTop: 10,
    marginBottom: 30,
    color: "white",
    fontSize: 18,
  },

  regBtn: {
    width: "80%",
    borderRadius: 4,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    backgroundColor: "#FC5A56",
    marginTop: 30,
    alignSelf: "center",
  },
  regBtnDisabled: {
    width: "100%",
    borderRadius: 4,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    backgroundColor: "grey",
    opacity: 0.4,
    marginTop: 20,
  },
  regText: {
    color: "white",
    fontSize: 20,
  },
});
export default ForgotPassword;
