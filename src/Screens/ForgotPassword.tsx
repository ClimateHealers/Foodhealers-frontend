// ForgotPassword.tsx

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
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { localized } from "../locales/localization";
import Spinner from "react-native-loading-spinner-overlay/lib";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { forgotPasswordValidationSchema } from "../Components/validation";
import PrimaryButton from "../Components/PrimaryButton";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.toLowerCase());
      setLoading(false);
      Alert.alert(
        localized.t("RESET_LINK_SENT_SUCCESSFULLY"),
        localized.t(
          "WE_HAVE_SUCCESSFULLY_SENT_THE_RESET_LINK_TO_THE_REGISTERED_EMAIL"
        ),
        [
          {
            text: localized.t("OK"),
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ],
        { cancelable: false }
      );
    } catch (err: any) {
      setLoading(false);
      Alert.alert(localized.t("EMAIL_NOT_FOUND"), err.message, [
        { text: localized.t("OK") },
      ]);
    }
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <StatusBar animated={true} backgroundColor="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {localized.t("FORGOT_PASSWORD")}
          </Text>
          <View style={{ width: wp(3) }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.instructionText}>
              {localized.t("ENTER_YOUR_EMAIL")}
            </Text>

            <Formik
              validationSchema={forgotPasswordValidationSchema}
              initialValues={{ email: "" }}
              onSubmit={({ email }) => handleResetPassword(email)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={localized.t("EMAIL")}
                    placeholderTextColor="#ffffffaa"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <Spinner visible={loading} textStyle={{ color: "white" }} />

                  <PrimaryButton
                    title={localized.t("SEND_RESET_LINK")}
                    buttonStyle={[
                      styles.button,
                      !isValid && styles.buttonDisabled,
                    ]}
                    titleStyle={styles.buttonText}
                    onPress={handleSubmit}
                  />
                </>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: Platform.OS === "android" ? hp(2) : 0,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4.5),
    paddingTop: hp(3),
    paddingBottom: hp(2),
    zIndex: 1,
  },
  headerTitle: {
    fontSize: wp(5),
    color: "white",
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  instructionText: {
    fontSize: hp(2),
    color: "white",
    marginBottom: hp(2.5),
    textAlign: "left",
  },
  input: {
    borderColor: "#ffffff99",
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    color: "white",
    fontSize: hp(2),
    marginBottom: hp(1),
  },
  errorText: {
    color: "red",
    fontSize: hp(1.6),
    marginBottom: hp(1.5),
  },
  button: {
    backgroundColor: "#FC5A56",
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    marginTop: hp(2),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2.2),
    fontWeight: "600",
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "grey",
    opacity: 0.6,
  },
});

export default ForgotPassword;
