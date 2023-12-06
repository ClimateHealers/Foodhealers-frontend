import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
import { postEventSchema } from "../Components/validation";
import { localized } from "../locales/localization";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";

const PostEvent = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
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
  const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | any>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [minmumEndDate, setMinmumEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date | any>(
    moment(new Date(selectedTime)).add(1, "hour")
  );

  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const eventDateTime = moment(selectedDate).utc().unix();

  const eventEndDateTime = moment(selectedEndDate).utc().unix();
  
  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const navigation: any = useNavigation();

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    if (selectedDate > selectedEndDate) {
      setSelectedEndDate(selectedDate);
    } else {
      setSelectedEndDate(date);
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

  const handleEndDateChange = (endDate: any) => {
    if (moment(endDate).isBefore(moment(selectedDate).add(1, "hour"))) {
      Alert.alert(
        `${localized.t("ALERT")}`,
        `${localized.t("YOU_CANT_SELECT_A_TIME_BEFORE")} ${moment(selectedDate)
          .add(1, "hour")
          .format("MMM DD, YYYY hh:mm A")}`
      );
    } else {
      setSelectedEndDate(endDate);
    }
    setShowEndDatePicker(false);
  };

  const handleEndTimeChange = (newTime: any) => {
    if (moment(selectedDate).isSame(selectedEndDate, "day")) {
      const minEndTime = moment(selectedTime).add(1, "hour");
      if (moment(newTime).isBefore(minEndTime)) {
        setSelectedEndTime(minEndTime);
      } else {
        setSelectedEndTime(newTime);
      }
    } else {
      setSelectedEndTime(newTime);
    }

    setShowEndTimePicker(false);
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
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
                  <Text style={styles.itemText}>
                    {localized.t("POST_AN_EVENT")}
                  </Text>
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
                validationSchema={postEventSchema}
                initialValues={{
                  eventName: "",
                  served: "",
                  lat: 0,
                  long: 0,
                  address: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  volunteers: 0,
                }}
                onSubmit={async ({
                  eventName,
                  served,
                  volunteers,
                  lat,
                  long,
                  address,
                  city,
                  state,
                  postalCode,
                }) => {
                  if (!city) {
                    alert(`${localized.t("PLEASE_ENTER_THE_FULL_ADDRESS")}`);
                    return;
                  }

                  await navigation.navigate("UploadPhotosScreen", {
                    eventFormData: {
                      eventName: eventName,
                      served: served,
                      eventDate: eventDateTime,
                      eventEndDateTime: eventEndDateTime,
                      lat: lat,
                      long: long,
                      address: address,
                      city: city,
                      state: state,
                      postalCode: Number(postalCode) ? Number(postalCode) : 0,
                      volunteers: Number(volunteers) ? Number(volunteers) : 0,
                    },
                  });
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
                      onChangeText={handleChange("eventName")}
                      onBlur={handleBlur("eventName")}
                      value={values.eventName}
                      placeholder={localized.t("EVENT_NAME")}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors.eventName}</Text>

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
                            component.types.includes(
                              "administrative_area_level_1"
                            )
                          ) {
                            const state = component.long_name;
                            setFieldValue("state", state);
                          }
                          if (component.types.includes("locality")) {
                            const city = component.long_name;
                            setFieldValue("city", city);
                          }

                          if (component.types.includes("postal_code")) {
                            const postalCode = component.long_name;
                            setFieldValue("postalCode", postalCode);
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
                              {localized.t("START_DATE")}
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
                              {localized.t("START_TIME")}
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
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setShowEndDatePicker(true)}
                      >
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
                              {localized.t("END_DATE")}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {moment(selectedEndDate).format("MMM DD, YYYY")}
                            </Text>
                          </View>
                          {showEndDatePicker && (
                            <DateTimePickerModal
                              isVisible={showEndDatePicker}
                              minimumDate={
                                new Date(moment(selectedDate).add(1, "hour"))
                              }
                              is24Hour={true}
                              date={
                                selectedEndDate
                                  ? new Date(selectedEndDate)
                                  : undefined
                              }
                              mode="datetime"
                              onConfirm={handleEndDateChange}
                              onCancel={() => setShowEndDatePicker(false)}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={true}
                        onPress={() => setShowEndTimePicker(true)}
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
                              {localized.t("END_TIME")}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 13,
                                marginBottom: 5,
                                marginLeft: 15,
                              }}
                            >
                              {moment(selectedEndDate).format("hh:mm A")}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      onChangeText={handleChange("served")}
                      onBlur={handleBlur("served")}
                      value={values?.served}
                      placeholder={localized.t("WHATS_BEING_SERVED")}
                      placeholderTextColor={"black"}
                      style={styles.textArea}
                      id={"served"}
                    />
                    <Text style={styles.inputError}>{errors.served}</Text>
                    <TextInput
                      onChangeText={handleChange("volunteers")}
                      onBlur={handleBlur("volunteers")}
                      value={values?.volunteers}
                      keyboardType="numeric"
                      placeholder={localized.t(
                        "NUMBERS_OF_VOLUNTEERS_REQUIRED"
                      )}
                      placeholderTextColor={"black"}
                      style={styles.textArea}
                      id={"volunteers"}
                    />
                    <Text style={styles.inputError}>{errors.volunteers}</Text>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
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

export default PostEvent;
