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
    .email("Please enter valid email")
    .required("Email is required"),
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
              // borderWidth: 1,
              height: 400,
              // alignItems:"center"
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
              <Text style={styles.header}> {localized.t("Forgot Password")} </Text>
            </View>
            <View style={styles.container2}>
              <Text style={styles.lineText}>
                {localized.t("Enter your email and we will send you a reset link!")}
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
                      "Reset Link sent successfully",
                      "We have successfully sent the reset link to the registered email.",
                      [{ text: "OK",
                      onPress: () => navigation.navigate("LoginScreen"),
                    }],
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
                      "Email not found",
                      `${err.message}`,
                      [{ text: "OK",
                      
                    }],
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
                        placeholder="Email"
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
                        // textContent="Posting event"
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
                        <Text style={styles.regText}>{localized.t("Send Reset Link")}</Text>
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
    color: "white"
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
