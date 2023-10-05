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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Text, TextInput } from "react-native-paper";
import PrimaryButton from "../Components/PrimaryButton";
import { AddDonations } from "../Components/validation";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import PhoneInput from "react-native-phone-number-input";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import { postDonation } from "../redux/actions/myDonations";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { localized } from "../locales/localization";

const AddDonationsScreen = ({ route }: any) => {
  const { itemTypeId, title } = route?.params;
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryPhoneCode, setCountryPhoneCode] = useState("");
  const phoneCode = countryPhoneCode.toString();
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | any>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [minmumEndDate, setMinmumEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );

  const phoneInput = useRef<PhoneInput>(null);

  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const eventDateTime = moment(selectedDate).utc().unix();

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    if (selectedDate > selectedEndDate) {
      setSelectedEndDate(selectedDate);
    } else {
      setSelectedEndDate(date);
    }
    setShowDatePicker(false);
  };

  useEffect(() => {
    setSelectedEndDate(moment(selectedDate).add(1, "hour"));
    setMinmumEndDate(moment(new Date(selectedTime)).add(1, "hour"));
  }, [selectedDate]);
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
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
                  <Text style={styles.itemText}>{title}</Text>
                </View>
                <BurgerIcon />
              </View>
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>

              <Formik
                validationSchema={AddDonations}
                initialValues={{
                  foodItem: "",
                  quantity: "",
                  phoneNumber: "",
                  flatNo: "",
                  lat: 0,
                  long: 0,
                  address: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  zipCode: "",
                }}
                onSubmit={async ({
                  foodItem,
                  quantity,
                  lat,
                  long,
                  address,
                  phoneNumber,
                  flatNo,
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
                      itemTypeId: itemTypeId,
                      foodName: foodItem,
                      quantity: quantity,
                      phoneNumber: phoneNumber,
                      pickupDate: eventDateTime,
                      lat: lat,
                      lng: long,
                      flatNo: flatNo,
                      fullAddress: address,
                      city: city,
                      state: state,
                      postalCode: Number(zipCode) ? Number(zipCode) : 0,
                    };
                    const res = await dispatch(
                      postDonation(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: "Donation added successfully",
                        error: false,
                      });
                      setLoading(false);
                      // resetForm({values: initialValues})
                      Alert.alert(
                        "Thank you for your donation!",
                        "We have successfully added your donation.",
                        [
                          {
                            text: "OK",
                            onPress: () =>
                              navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    {
                                      name: "VolunteerThankYouScreen",
                                      params: {
                                        itemTypeId: itemTypeId,
                                        title: title,
                                      },
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
                      console.log("Error");
                    }
                  } catch (err: any) {
                    setLoading(false);
                    setResponse({
                      loading: false,
                      message: err.message,
                      error: true,
                    });
                    Alert.alert(
                      "Donation not added",
                      `${err.message}`,
                      [{ text: "OK" }],
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
                      onChangeText={handleChange("foodItem")}
                      onBlur={handleBlur("foodItem")}
                      value={values?.foodItem}
                      placeholder={
                        itemTypeId == 1
                          ? `${localized.t("FOOD_ITEM")}`
                          : `${localized.t("SUPPLIES_LIST")}`
                      }
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors?.foodItem}</Text>
                    <TextInput
                      onChangeText={handleChange("quantity")}
                      onBlur={handleBlur("quantity")}
                      value={values?.quantity}
                      placeholder={localized.t("QUANTITY")}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors?.quantity}</Text>
                    <TextInput
                      onChangeText={handleChange("flatNo")}
                      onBlur={handleBlur("flatNo")}
                      keyboardType="numeric"
                      value={values?.flatNo}
                      placeholder={localized.t("FLAT_NO")}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors?.flatNo}</Text>
                    <GooglePlacesAutocomplete
                      placeholder={localized.t("ADDRESS")}
                      fetchDetails={true}
                      keepResultsAfterBlur={true}
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
                        setFieldValue("address", details?.formatted_address);

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
                          if (component?.types?.includes("country")) {
                            const country = component?.short_name;
                            setCountryPhoneCode(country);
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
                          paddingLeft: 16,
                        },
                        predefinedPlacesDescription: {
                          color: "#FFFFFF",
                        },
                      }}
                    />
                    <Text style={styles.inputError}>{errors.address}</Text>
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
                          placeholder={localized.t("CITY")}
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
                          placeholder={localized.t("STATE")}
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
                        placeholder={localized.t("ZIP_CODE")}
                        placeholderTextColor={"black"}
                        style={[styles.textInput]}
                      />
                    </View>

                    <Text style={styles.inputError}>{errors?.zipCode}</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <View style={styles.dateTimePickerContainer}>
                          <View>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {localized.t("PICKUP_DATE")}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {moment(selectedDate).format("MMM, DD, YYYY")}
                            </Text>
                          </View>
                          {showDatePicker && (
                            <DateTimePickerModal
                              isVisible={showDatePicker}
                              minimumDate={new Date()}
                              date={
                                selectedDate
                                  ? new Date(selectedDate)
                                  : undefined
                              }
                              mode="datetime"
                              is24Hour={true}
                              onConfirm={handleDateChange}
                              onCancel={() => setShowDatePicker(false)}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={true}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <View
                          style={[
                            styles.dateTimePickerContainer,
                            { backgroundColor: "#deddd9" },
                          ]}
                        >
                          <View>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                width: 200,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {localized.t("PICKUP_TIME")}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {moment(selectedDate).format("hh:mm A")}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PhoneInput
                        ref={phoneInput}
                        defaultCode={"US"}
                        // initialCountry={countryPhoneCode}
                        placeholder={localized.t("PHONE_NUMBER")}
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
                        title={localized.t("SUBMIT")}
                        buttonStyle={styles.buttonStyles}
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

export default AddDonationsScreen;
