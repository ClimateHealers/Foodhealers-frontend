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
      Alert.alert(
        localized.t("EMAIL_NOT_FOUND"),
        err.message,
        [{ text: localized.t("OK") }],
        { cancelable: false }
      );
    }
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <StatusBar animated={true} backgroundColor="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.root}>
          <Ionicons
            name="chevron-back"
            size={wp("8%")}
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>
            {localized.t("FORGOT_PASSWORD")}
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
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
                      style={styles.textInput}
                      placeholder={localized.t("EMAIL")}
                      placeholderTextColor="white"
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

                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={!isValid}
                      style={[styles.button, !isValid && styles.buttonDisabled]}
                    >
                      <Text style={styles.buttonText}>
                        {localized.t("SEND_RESET_LINK")}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
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
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === "android" ? hp(2) : 0,
  },
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  headerText: {
    fontSize: hp(2.5),
    color: "white",
    marginLeft: wp(2),
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
  },
  instructionText: {
    marginBottom: hp(2),
    color: "white",
    fontSize: hp(2),
  },
  textInput: {
    height: hp(6.5),
    borderColor: "white",
    borderWidth: 1,
    paddingLeft: wp(3),
    fontSize: hp(1.8),
    color: "white",
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  errorText: {
    color: "red",
    marginBottom: hp(1),
    fontSize: hp(1.6),
  },
  button: {
    height: hp(6.5),
    backgroundColor: "#FC5A56",
    borderRadius: wp(2),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
    marginHorizontal: hp(3),
  },
  buttonDisabled: {
    backgroundColor: "grey",
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: hp(2.2),
    fontWeight: "600",
  },
});

export default ForgotPassword;
