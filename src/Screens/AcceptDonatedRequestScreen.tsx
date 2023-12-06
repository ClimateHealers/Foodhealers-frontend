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
import { AddRequest } from "../Components/validation";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import PhoneInput from "react-native-phone-number-input";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { acceptDonation } from "../redux/actions/acceptDonationAction";

const AcceptDonatedRequestScreen = ({ route }: any) => {
  const {
    itemTypeId,
    title,
    foodItem,
    id,
    quantity,
    latitude,
    longitude,
    requiredDate,
  } = route?.params;
  const [loading, setLoading] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryPhoneCode, setCountryPhoneCode] = useState<string>("");
  const phoneCode = countryPhoneCode.toString();
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [selectedTime, setSelectedTime] = useState<Date | any>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | any>(
    moment(new Date(requiredDate)).add(2, "hour")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [minmumEndDate, setMinmumEndDate] = useState<Date | any>(
    moment(new Date(requiredDate)).add(12, "hour")
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date | any>(
    moment(new Date(selectedTime)).add(1, "hour")
  );

  var dropOffDate = new Date(requiredDate);
  dropOffDate?.setHours(dropOffDate?.getHours() + 12);

  const phoneInput = useRef<PhoneInput>(null);

  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const eventDateTime = moment(selectedDate).utc().unix();

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const navigation: any = useNavigation();

  const handleDateChange = (date: any) => {
    if (moment(date).isBefore(moment(requiredDate).add(1, "hour"))) {
      Alert.alert(
        `${localized.t("ALERT")}`,
        `${localized.t("YOU_CANT_SELECT_A_TIME_BEFORE")} ${moment(requiredDate)
          .add(1, "hour")
          .format("MMM DD, YYYY hh:mm A")}`
      );
    } else {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (time: any) => {
    setSelectedTime(time);
    if (moment(selectedDate).isSame(selectedEndDate, "day")) {
      setSelectedEndTime(moment(selectedTime).add(1, "hour"));
    }
    setShowTimePicker(false);
  };

  useEffect(() => {
    setSelectedEndDate(moment(selectedDate).add(1, "hour"));
    setMinmumEndDate(moment(new Date(requiredDate)).add(12, "hour"));
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
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
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
                validationSchema={AddRequest}
                initialValues={{
                  foodItem: foodItem,
                  quantity: quantity,
                  phoneNumber: "",
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
                      donationId: id,
                      pickupRequestTypeId: 4,
                      itemName: foodItem,
                      quantity: quantity,
                      phoneNumber: phoneNumber,
                      dropDate: eventDateTime,
                      lat: lat,
                      lng: long,
                      fullAddress: address,
                      city: city,
                      state: state,
                      postalCode: Number(zipCode) ? Number(zipCode) : 0,
                    };
                    const res = await dispatch(
                      acceptDonation(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: "REQUEST_ADDED_SUCCESSFULLY",
                        error: false,
                      });
                      setLoading(false);
                      Alert.alert(
                        `${localized.t("REQUEST_ADDED")}`,
                        `${localized.t(
                          "WE_HAVE_SUCCESSFULLY_ADDED_YOUR_REQUEST"
                        )}`,
                        [
                          {
                            text: `${localized.t("OK")}`,
                            onPress: () =>
                              navigation.navigate("RequestCreatedScreen", {
                                itemTypeId: itemTypeId,
                                title: title,
                                address: address,
                                eventDateTime: selectedDate,
                                foodItem: foodItem,
                              }),
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      setLoading(false);
                      console.log("ERROR");
                    }
                  } catch (err: any) {
                    setLoading(false);
                    setResponse({
                      loading: false,
                      message: err.message,
                      error: true,
                    });
                    Alert.alert(
                      `${localized.t("REQUEST_NOT_ADDED")}`,
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
                      onChangeText={handleChange("foodItem")}
                      onBlur={handleBlur("foodItem")}
                      value={values?.foodItem}
                      placeholder={
                        itemTypeId == 1
                          ? `${localized.t("FOOD_ITEM")}`
                          : `${localized.t("SUPPLIES_LIST")}`
                      }
                      placeholderTextColor={"black"}
                      style={[
                        styles.textInput,
                        { backgroundColor: foodItem ? "#deddd9" : "white" },
                      ]}
                    />
                    <Text style={styles.inputError}>{errors?.foodItem}</Text>
                    <TextInput
                      onChangeText={handleChange("quantity")}
                      onBlur={handleBlur("quantity")}
                      value={values?.quantity}
                      placeholder={localized.t("QUANTITY")}
                      placeholderTextColor={"black"}
                      style={[
                        styles.textInput,
                        { backgroundColor: quantity ? "#deddd9" : "white" },
                      ]}
                    />
                    <Text style={styles.inputError}>{errors?.quantity}</Text>
                    <GooglePlacesAutocomplete
                      placeholder={localized.t("ADDRESS")}
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
                              {localized.t("DATE")}
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
                              minimumDate={new Date(requiredDate)}
                              maximumDate={new Date(minmumEndDate)}
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
                              {localized.t("TIME")}
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

export default AcceptDonatedRequestScreen;
