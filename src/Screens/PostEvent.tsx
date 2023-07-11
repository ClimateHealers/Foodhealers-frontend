import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { logOut } from "../redux/reducers/authreducers";

const PostEvent = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | any>(
    new Date()
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date | undefined>(
    new Date()
  );
  const [validation, setValidation] = useState(false);
  const minTime =
    moment(selectedDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")
      ? new Date()
      : moment(selectedDate).startOf("day");

  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const eventDate = moment(selectedDate);
  const eventTime = moment(selectedTime);

  const eventEndDate = moment(selectedEndDate);
  const eventEndTime = moment(selectedEndTime);

  eventDate.set({
    hour: eventTime.hour(),
    minute: eventTime.minute(),
    second: eventTime.second(),
  });
  eventEndDate.set({
    hour: eventEndTime.hour(),
    minute: eventEndTime.minute(),
    second: eventEndTime.second(),
  });

  const eventDateTime = eventDate.utc().unix();

  const eventEndDateTime = eventEndDate.utc().unix();

  console.log("checking evenntDate Time", eventDateTime);
  console.log("checking eventEndDateTime Time", eventEndDateTime);
  //
  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const handleDateChange = (date: any) => {
    console.log("checkgin selected date", date);
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
    if (selectedTime > selectedEndTime) {
      setSelectedEndTime(selectedTime);
    } else {
      setSelectedEndTime(time);
    }
    setShowTimePicker(false);
  };

  const handleEndDateChange = (newDate: any) => {
    console.log("checking selected end date", newDate);
    setSelectedEndDate(newDate);
    setShowEndDatePicker(false);
  };

  const handleEndTimeChange = (newTime: any) => {
    setSelectedEndTime(newTime);
    setShowEndTimePicker(false);
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
    });
    
    setMenuOpen(false);
  };
  const logout = async (item: any) => {
    // persistor.purge()
    await dispatch(logOut({}) as any);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <ScrollView style={styles.root}>
          <StatusBar animated={true} backgroundColor="auto" />
          {menuOpen && (
            <View
              style={{
                position: "absolute",
                right: 45,
                top: 95,
                backgroundColor: "white",
                borderColor: "white",

                borderRadius: 5,
                zIndex: 9999,
              }}
            >
              <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "300",
                    lineHeight: 27.24,
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => findFoodMenuItemPress("Find Food")}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "300",
                    lineHeight: 27.24,
                  }}
                >
                  Find Food
                </Text>
              </TouchableOpacity>
              {isAuthenticated && (
                <TouchableOpacity onPress={() => logout("logout")}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    Log out
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.dropdownContainer}>
            <View style={styles.item}>
              <Text style={styles.itemText}>Post an Event</Text>
            </View>
            <MaterialCommunityIcons
              name="menu"
              size={40}
              color="white"
              onPress={toggleMenu}
              style={{
                marginRight: 20,
              }}
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
              eventDate: eventDate,
              eventTime: eventTime,
              lat: 0,
              long: 0,
              address: "",
              city: "",
              state: "",
              postalCode: "",
            }}
            onSubmit={async ({
              eventName,
              served,
              eventDate,
              eventTime,
              lat,
              long,
              address,
              city,
              state,
              postalCode,
            }) =>
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
                },
              })
            }
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
                  // placeholder={localized.t("Email")}
                  placeholder={"Event name"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors.eventName}</Text>

                <GooglePlacesAutocomplete
                  placeholder="Address"
                  fetchDetails={true}
                  keepResultsAfterBlur={true}
                  listViewDisplayed="auto"
                  textInputProps={{ placeholderTextColor: "#000000" }}
                  query={{
                    key: API_KEY, //sachin
                    language: "en",
                  }}
                  enablePoweredByContainer={false}
                  onPress={(data, details) => {
                    setFieldValue("lat", details?.geometry?.location?.lat);
                    setFieldValue("long", details?.geometry?.location?.lng);
                    setFieldValue("address", details?.formatted_address);

                    const addressComponents = details?.address_components || [];
                    addressComponents.forEach((component) => {
                      if (
                        component.types.includes("administrative_area_level_1")
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
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={styles.dateTimePickerContainer}>
                      <View>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          Start Date
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                        }}>
                          {moment(selectedDate).format("MMM DD, YYYY")}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={showDatePicker}
                        minimumDate={new Date()}
                        mode="date"
                        onConfirm={handleDateChange}
                        onCancel={() => setShowDatePicker(false)}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <View style={styles.dateTimePickerContainer}>
                      {/* <IconButton icon="calendar" size={20} /> */}
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
                          Start Time
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          {moment(selectedTime).format("hh:mm A")}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={showTimePicker}
                        // is24Hour={true}
                        minimumDate={new Date(minTime)}
                        mode="time"
                        onConfirm={handleTimeChange}
                        onCancel={() => setShowTimePicker(false)}
                      />
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
                  <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                    <View style={styles.dateTimePickerContainer}>
                      <View>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          End Date
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          {selectedDate > selectedEndDate
                            ? moment(selectedDate).format("MMM DD, YYYY")
                            : moment(selectedEndDate).format("MMM DD, YYYY")}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={showEndDatePicker}
                        minimumDate={selectedDate}
                        mode="date"
                        onConfirm={handleEndDateChange}
                        onCancel={() => setShowEndDatePicker(false)}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                    <View style={styles.dateTimePickerContainer}>
                      {/* <IconButton icon="calendar" size={20} /> */}
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
                          End Time
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          {/* {moment(selectedEndTime).format("hh:mm A")} */}
                          {selectedTime > selectedEndTime
                            ? moment(selectedTime).format("hh:mm A")
                            : moment(selectedEndTime).format("hh:mm A")}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={showEndTimePicker}
                        // is24Hour={true}
                        minimumDate={selectedTime} // selectedEndDate!==selectedDate ? null:selectedTime
                        mode="time"
                        onConfirm={handleEndTimeChange}
                        onCancel={() => setShowEndTimePicker(false)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <TextInput
                  onChangeText={handleChange("served")}
                  onBlur={handleBlur("served")}
                  value={values.served}
                  // placeholder={localized.t("Password")}
                  // multiline={true}
                  placeholder={"What's being served"}
                  placeholderTextColor={"black"}
                  style={styles.textArea}
                />
                <Text style={styles.inputError}>{errors.served}</Text>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: h2dp("5"),
                  }}
                >
                  <PrimaryButton
                    // title={localized.t("Sign in")}
                    title={"Submit"}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                    onPress={handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  root: {
    display: "flex",
    marginBottom: 50,
    flexDirection: "column",
    flex: 1,
    marginVertical: 16,
    marginHorizontal: w2dp("4%"),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
    marginTop: Platform.OS === "ios" ? h2dp(5) : h2dp(5),
  },
  titleStyle: {
    color: "white",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 30,
    borderColor: "red",
  },
  inputError: {
    color: "red",
    marginBottom: 10,
  },

  textInput: {
    height: 50,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 50,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  DateStyle: {
    height: 45,
    backgroundColor: "#FFFFFF",
  },

  item: {
    marginRight: 55,
    height: 100,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  datePickerStyle: {
    width: 345,
    height: 45,
    marginBottom: 20,
    borderColor: "white",
    backgroundColor: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
  },
  inputView: {
    justifyContent: "flex-start",
    borderColor: "#000000",
    borderWidth: 1,
    width: "100%",
    height: 50,
    marginTop: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  dateTimePickerContainer: {
    backgroundColor: "white",
    borderRadius: 3,
    paddingVertical: 5,
    marginBottom: 25,
    height: 50,
    width: w2dp(45),
  },
});

export default PostEvent;
