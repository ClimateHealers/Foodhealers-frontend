import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Text, TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { addDriver } from "../Components/validation";
import { localized } from "../locales/localization";
import { fetchUser, updateProfile } from "../redux/actions/authAction";

const UpdateProfileScreen = ({ route }: any) => {
  const {
    name,
    phoneNumber,
    email,
    lat,
    long,
    volunteerFullAddress,
    city,
    state,
    zipCode,
  } = route?.params;
  const menuItem = "Account";
  const [menuClose, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [data, setData] = useState<any>([]);
  const phoneInput = useRef<PhoneInput>(null);
  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };
  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const navigation: any = useNavigation();

  useEffect(() => {
    fetchingUserData()
      .then(() => {
      })
      .catch((err) => {
        console.log("Error in fetchingUserData: ", err);
      });
  }, []);
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.container}>
              <FoodhealersHeader />
              <View style={styles.root}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("PROFILE_UPDATE")}
                  </Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                  menuItem={menuItem}
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
                validationSchema={addDriver}
                initialValues={{
                  name: name,
                  phoneNumber: phoneNumber,
                  email: email,
                  lat: lat,
                  long: long,
                  volunteerFullAddress: volunteerFullAddress,
                  city: city,
                  state: state,
                  zipCode: zipCode,
                }}
                onSubmit={async ({
                  name,
                  lat,
                  email,
                  long,
                  volunteerFullAddress,
                  phoneNumber,
                  city,
                  state,
                  zipCode,
                }) => {
                  setLoading(true);
                  try {
                    setResponse({
                      loading: true,
                      message: "",
                      error: false,
                    });
                    const data = {
                      name: name,
                      email: email,
                      phoneNumber: phoneNumber,
                      lat: lat,
                      lng: long,
                      fullAddress: volunteerFullAddress,
                      city: city,
                      state: state,
                      postalCode: Number(zipCode) ? Number(zipCode) : 0,
                    };
                    const res = await dispatch(
                      updateProfile(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: `${localized.t("PROFILE_UPDATE_SUCCESS")}`,
                        error: false,
                      });
                      setLoading(false);
                      Alert.alert(
                        `${localized.t("PROFILE_UPDATE_SUCCESS")}`,
                        `${localized.t(
                          "YOUR_PROFILE_HAS_BEEN_UPDATED_SUCCESSFULLY"
                        )}`,
                        [
                          {
                            text: "OK",
                            onPress: () =>
                              navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    {
                                      name: "ProfileScreen",
                                    },
                                  ],
                                })
                              ),
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      setLoading(false);
                      Alert.alert(
                        `${localized.t("ALERT")}`,
                        `${res?.payload}`,
                        [
                          {
                            text: `${localized.t("OK")}`,
                            style: "cancel",
                          },
                        ],
                        { cancelable: true }
                      );
                    }
                  } catch (err: any) {
                    setLoading(false);
                    setResponse({
                      loading: false,
                      message: err?.message,
                      error: true,
                    });
                    Alert.alert(
                      `${localized.t("PROFILE_NOT_UPDATED")}`,
                      `${err.message}`,
                      [{ text: `${localized.t("OK")}` }],
                      { cancelable: false }
                    );
                  }
                }}
              >
                {({
                  handleSubmit,
                  handleBlur,
                  handleChange,
                  values,
                  setFieldValue,
                  errors,
                  touched,
                  isValid,
                }) => (
                  <>
                    <TextInput
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values?.name}
                      placeholder={
                        name ? name : `${localized.t("VOLUNTEER_NAME")}`
                      }
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors?.name}</Text>
                    <TextInput
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values?.email?.toLocaleLowerCase()}
                      placeholder={email ? email : localized.t("EMAIL")}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors.email}</Text>
                    <GooglePlacesAutocomplete
                      placeholder={
                        volunteerFullAddress
                          ? volunteerFullAddress
                          : `${localized.t("ADDRESS")}`
                      }
                      fetchDetails={true}
                      listViewDisplayed="auto"
                      textInputProps={{ placeholderTextColor: "#000000" }}
                      query={{
                        key: API_KEY,
                        language: "en",
                      }}
                      enablePoweredByContainer={false}
                      onPress={(data, details) => {
                        setFieldValue("lat", details?.geometry?.location?.lat);
                        setFieldValue("long", details?.geometry?.location?.lng);
                        setFieldValue(
                          "volunteerFullAddress",
                          details?.formatted_address
                        );

                        const addressComponents =
                          details?.address_components || [];
                        addressComponents.forEach((component) => {
                          if (
                            component?.types?.includes(
                              "administrative_area_level_1"
                            )
                          ) {
                            const state = component?.long_name;
                            setFieldValue("state", state);
                          }
                          if (component?.types?.includes("locality")) {
                            const city = component?.long_name;
                            setFieldValue("city", city);
                          }

                          if (component?.types?.includes("postal_code")) {
                            const zipCode = component?.long_name;
                            setFieldValue("zipCode", zipCode);
                          }
                        });
                      }}
                      onFail={(error) => {
                        console.log(error);
                      }}
                      onNotFound={() => {
                        console.log("no results");
                      }}
                      styles={{
                        textInputContainer: {
                          borderColor: "black",
                          borderRadius: 3,
                          height: 50,
                          zIndex: 1,
                          width: "100%",
                        },
                        textInput: {
                          color: "black",
                          height: 50,
                          backgroundColor: "white",
                        },
                        predefinedPlacesDescription: {
                          color: "#FFFFFF",
                        },
                      }}
                    />
                    <Text style={styles.inputError}>
                      {errors?.volunteerFullAddress}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "#deddd9" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("city")}
                          onBlur={handleBlur("city")}
                          value={values?.city}
                          placeholder={city ? city : localized.t("CITY")}
                          placeholderTextColor={"black"}
                          style={[
                            styles.textInput,
                            { backgroundColor: "#deddd9" },
                          ]}
                          editable={false}
                        />
                      </View>
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "#deddd9" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("state")}
                          onBlur={handleBlur("state")}
                          value={values?.state}
                          placeholder={state ? state : localized.t("STATE")}
                          placeholderTextColor={"black"}
                          style={[
                            styles.textInput,
                            { backgroundColor: "#deddd9" },
                          ]}
                          editable={false}
                        />
                      </View>
                    </View>
                    <View>
                      <TextInput
                        onChangeText={handleChange("zipCode")}
                        onBlur={handleBlur("zipCode")}
                        value={values?.zipCode}
                        keyboardType="numeric"
                        placeholder={
                          zipCode ? zipCode : localized.t("ZIP_CODE")
                        }
                        placeholderTextColor={"black"}
                        style={[styles.textInput]}
                      />
                    </View>
                    <Text style={styles.inputError}>{errors?.zipCode}</Text>
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PhoneInput
                        ref={phoneInput}
                        placeholder={
                          phoneNumber
                            ? phoneNumber?.slice(2, 12)
                            : localized.t("PHONE_NUMBER")
                        }
                        onChangeText={(text) => {
                          const callingCode =
                            phoneInput.current?.getCallingCode();
                          setFieldValue("phoneNumber", `${callingCode}${text}`);
                        }}
                        containerStyle={[
                          styles.textArea,
                          {
                            width: "100%",
                            alignContent: "center",
                            justifyContent: "center",
                          },
                        ]}
                        value={values.phoneNumber}
                        textInputProps={{ placeholderTextColor: "black" }}
                        textInputStyle={{}}
                      />
                      <Text style={styles.inputError}>
                        {errors?.phoneNumber}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: h2dp(1),
                      }}
                    >
                      <PrimaryButton
                        title={localized.t("UPDATE")}
                        buttonStyle={styles.nextButtonStyles}
                        titleStyle={styles.titleStyle}
                        onPress={handleSubmit}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default UpdateProfileScreen;
