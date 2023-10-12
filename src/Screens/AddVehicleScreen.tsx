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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text, TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import PrimaryButton from "../Components/PrimaryButton";
import { getLocation } from "../Components/getCurrentLocation";
import { addDriver, addVolunteer } from "../Components/validation";
import { localized } from "../locales/localization";
import { volunteerAtEvent } from "../redux/actions/volunteerAction";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { updateProfile } from "../redux/actions/authAction";
import { addVehicle } from "../redux/actions/addVehicle";

const AddVehicleScreen = ({ route }: any) => {
  // const { id, title, itemTypeId } = route?.params;
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
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

  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  console.log("ncjsdbvjdb", data);
  const eventDateTime = moment(selectedDate).utc().unix();
  const eventEndDateTime = moment(selectedEndDate).utc().unix();
  const [minmumEndDate, setMinmumEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date | any>(
    moment(new Date(selectedTime)).add(1, "hour")
  );
  const phoneInput = useRef<PhoneInput>(null);

  const dispatch = useDispatch();

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const navigation: any = useNavigation();

  useEffect(() => {
    setSelectedEndDate(moment(selectedDate).add(1, "hour"));
    setMinmumEndDate(moment(new Date(selectedTime)).add(1, "hour"));
  }, [selectedDate]);
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
              <View
                style={[
                  styles.root,
                  {
                    marginBottom: h2dp(7),
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>Drive</Text>
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
                // validationSchema={addDriver}
                initialValues={{
                  carModel: "",
                  carColor: "",
                  licencePlate: "",
                  carMake: "",
                }}
                onSubmit={async ({
                  carModel,
                  carColor,
                  licencePlate,
                  carMake,
                }) => {
                  setLoading(true);
                  try {
                    setResponse({
                      loading: true,
                      message: "",
                      error: false,
                    });
                    const data = {
                      model: carModel,
                      vehicleColour: carColor,
                      plateNumber: licencePlate,
                      make: carMake,
                      active: true,
                    };
                    const res = await dispatch(
                      addVehicle(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: "Volunteer registerd successfully",
                        error: false,
                      });
                      setLoading(false);
                      Alert.alert(
                        "Driver added successfully!",
                        "You have been successfully added as a driver.",
                        [
                          {
                            text: "OK",
                            // onPress: () =>
                            //   navigation.dispatch(
                            //     CommonActions.reset({
                            //       index: 0,
                            //       routes: [
                            //         {
                            //           name: "VolunteerThankYouScreen",
                            //           params: {
                            //             id: id,
                            //             itemTypeId: itemTypeId,
                            //             title: title,
                            //           },
                            //         },
                            //       ],
                            //     })
                            //   ),
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
                            text: "ok",
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
                      "Volunteer not added",
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
                          { backgroundColor: "white" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("carMake")}
                          onBlur={handleBlur("carMake")}
                          value={values.carMake}
                          placeholder={"Car make"}
                          placeholderTextColor={"black"}
                          style={styles.textInput}
                        />
                        <Text style={styles.inputError}>{errors.carMake}</Text>
                      </View>
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "white" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("carModel")}
                          onBlur={handleBlur("carModel")}
                          value={values?.carModel}
                          placeholder={"Car model"}
                          placeholderTextColor={"black"}
                          style={styles.textInput}
                        />
                        <Text style={styles.inputError}>
                          {errors?.carModel}
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      onChangeText={handleChange("carColor")}
                      onBlur={handleBlur("carColor")}
                      value={values.carColor}
                      placeholder={"Car color"}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors.carColor}</Text>
                    <View>
                      <TextInput
                        onChangeText={handleChange("licencePlate")}
                        onBlur={handleBlur("licencePlate")}
                        value={values?.licencePlate}
                        placeholder={"Licence plate Number"}
                        placeholderTextColor={"black"}
                        style={[styles.textInput]}
                      />
                    </View>
                    <Text style={styles.inputError}>
                      {errors?.licencePlate}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: h2dp(1),
                      }}
                    >
                      <PrimaryButton
                        title={localized.t("NEXT")}
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

export default AddVehicleScreen;
