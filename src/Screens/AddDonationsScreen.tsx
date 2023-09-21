import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { GOOGLE_API_KEY } from "@env";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Text, TextInput } from "react-native-paper";
import PrimaryButton from "../Components/PrimaryButton";
import { AddDonations, postEventSchema } from "../Components/validation";
import { localized } from "../locales/localization";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { logOut } from "../redux/reducers/authreducers";
import { removeAuthData } from "../redux/actions/authAction";
import PhoneInput from "react-native-phone-number-input";

const AddDonationsScreen = () => {
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

  const [searchedCity, setSearchedCity] = useState("");
  const [searchedState, setSearchedState] = useState("");

  const phoneInput = useRef<PhoneInput>(null);

  

 
  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const eventDateTime = moment(selectedDate).utc().unix();

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if(res){
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });

    setMenuOpen(false);
  };

  useEffect(() => {
    setSelectedEndDate(moment(selectedDate).add(1, "hour"));
    setMinmumEndDate(moment(new Date(selectedTime)).add(1, "hour"));
  }, [selectedDate]);
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
                borderColor: "black",
                borderWidth:0.2,
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProfileScreen")}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    Account
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.dropdownContainer}>
            <View style={styles.item}>
              <Text style={styles.itemText}>Donate food</Text>
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
            validationSchema={AddDonations}
            initialValues={{
              foodItem: "",
              quantity: "",
              phoneNumber: "",
              flatNo:"",
              address: "",
              city: searchedCity,
              state: searchedState,
              postalCode: "",
              zipCode: "",
            }}
            onSubmit={async ({
              foodItem,
              quantity,
              address,
              phoneNumber,
              city,
              state,
              postalCode,
            }) => {
              if (!city) {
                alert("Please enter the full address.");
                return;
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
                  // placeholder={localized.t("Email")}
                  placeholder={"Food Item"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors?.foodItem}</Text>
                <TextInput
                  onChangeText={handleChange("quantity")}
                  onBlur={handleBlur("quantity")}
                  value={values?.quantity}
                  placeholder={"Quantity"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors?.quantity}</Text>
                <TextInput
                  onChangeText={handleChange("flatNo")}
                  onBlur={handleBlur("flatNo")}
                  keyboardType="numeric"
                  value={values?.flatNo}
                  placeholder={"Flat No."}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
                <Text style={styles.inputError}>{errors?.flatNo}</Text>
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
                        component?.types?.includes("administrative_area_level_1")
                      ) {
                        const state = component?.long_name;
                        setFieldValue("state", state);
                        setSearchedState(state);
                      }
                      if (component?.types?.includes("locality")) {
                        const city = component?.long_name;
                        setFieldValue("city", city);
                        setSearchedCity(city);
                      }

                      if (component?.types?.includes("postal_code")) {
                        const postalCode = component?.long_name;
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
                      placeholder={"City"}
                      placeholderTextColor={"black"}
                      style={[styles.textInput, { backgroundColor: "#deddd9" }]}
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
                      placeholder={"State"}
                      placeholderTextColor={"black"}
                      style={[styles.textInput, { backgroundColor: "#deddd9" }]}
                      editable={false}
                    />
                  </View>
                </View>
                <TextInput
                  onChangeText={handleChange("zipCode")}
                  onBlur={handleBlur("zipCode")}
                  value={values?.zipCode}
                  keyboardType="numeric"
                  placeholder={"Zip Code"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                />
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
                            // width: 200,
                            marginBottom: 5,
                            marginLeft: 15,
                          }}
                        >
                          Pickup Date
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
                      {showDatePicker && (
                        <DateTimePickerModal
                          isVisible={showDatePicker}
                          minimumDate={new Date()}
                          date={
                            selectedDate ? new Date(selectedDate) : undefined
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
                          Pickup Time
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

                <PhoneInput
                ref={phoneInput}
                  defaultCode={"US"}
                  placeholder={"Phone Number"}
                  layout="first"
                  onChangeText={(text) => {
                    const callingCode = phoneInput.current?.getCallingCode();
                    console.log("text", callingCode,text)
                    setFieldValue('phoneNumber', `${callingCode}${text}`);
                  }}
                  containerStyle={[styles.textArea, { width: "100%" }]}
                  value={values.phoneNumber}
                  textInputProps={{placeholderTextColor:"black"}}
                  
                />
                <Text style={styles.inputError}>{errors?.phoneNumber}</Text>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: h2dp(1),
                  }}
                >
                  <PrimaryButton
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
    marginBottom: h2dp(7),
    flexDirection: "column",
    flex: 1,
    // marginVertical: 16,
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
    marginTop: h2dp(1),
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

export default AddDonationsScreen;
