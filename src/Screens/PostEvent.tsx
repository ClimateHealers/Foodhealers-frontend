import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { localized } from "../locales/localization";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../Components/PrimaryButton";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { loadFonts } from "../font";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { login, registerUser } from "../redux/actions/authAction";
import { postEventSchema, signupSchema } from "../Components/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { Button } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  widthPercentageToDP as w2dp,
  heightPercentageToDP as h2dp,
} from "react-native-responsive-screen";

const PostEvent = () => {
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(
    new Date()
  );

  const eventDate = moment(selectedDate).utc();
  const eventTime = moment(selectedTime).utc();

  eventDate.set({
    hour: eventTime.hour(),
    minute: eventTime.minute(),
    second: eventTime.second(),
  });

  const eventDateTime = eventDate.unix();

  const dispatch = useDispatch();

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      setSelectedTime(time);
      // console.log("kkkkkkkkkkkkkkkkkkkkk", time);
    }
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
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    // navigation.navigate("MapScreen");
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
                height: 100,
                borderRadius: 5,
                zIndex: 9999,
                // elevation:0
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
                  // eventTime: eventTime,
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
                    key: "AIzaSyBgYGulsDfu4VFt_tcPfQwAPjZccMe7nA0",
                    language: "en",
                    // components: "country:nz",
                  }}
                  enablePoweredByContainer={false}
                  onPress={(data, details) => {
                    console.log(
                      "tttttttttttttttttttttttttttttttttt",
                      details?.address_components[0]?.types
                    );
                    setFieldValue("lat", details?.geometry?.location?.lat);
                    setFieldValue("long", details?.geometry?.location?.lng);
                    setFieldValue("address", details?.formatted_address);

                    const addressComponents = details?.address_components || [];
                    addressComponents.forEach((component) => {
                      if (
                        component.types.includes("administrative_area_level_1")
                      ) {
                        const state = component.long_name;
                        console.log("State:", state);
                        setFieldValue("state", state);
                      }

                      if (component.types.includes("locality")) {
                        const city = component.long_name;
                        console.log("City:", city);
                        setFieldValue("city", city);
                      }

                      if (component.types.includes("postal_code")) {
                        const postalCode = component.long_name;
                        console.log("Postal Code:", postalCode);
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
                      // borderWidth: 1,
                      borderRadius: 3,
                      // marginBottom: 18,
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
                <View style={styles.dateTimePickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate!}
                    minimumDate={new Date()}
                    mode={"date"}
                    neutralButton={{ label: "Clear", textColor: "grey" }}
                    onChange={handleDateChange}
                  />
                </View>
                <View style={styles.dateTimePickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedTime!}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                </View>

                <TextInput
                  onChangeText={handleChange("served")}
                  onBlur={handleBlur("served")}
                  value={values.served}
                  // placeholder={localized.t("Password")}
                  multiline={true}
                  placeholder={"What's being served"}
                  placeholderTextColor={"black"}
                  style={styles.textArea}
                />
                <Text style={styles.inputError}>{errors.served}</Text>

                <PrimaryButton
                  // title={localized.t("Sign in")}
                  title={"Submit"}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={handleSubmit}
                />
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
    // justifyContent: 'center',
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
    // marginBottom: 150,
    marginTop: 80,
    marginLeft: 75,
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
    paddingRight: 250,
    paddingVertical: 5,
    marginBottom: 25,
    height: 45,
  },
});

export default PostEvent;
