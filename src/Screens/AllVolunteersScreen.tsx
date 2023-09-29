import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
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
import { Text, TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";

const AllVolunteersScreen = ({ route }: any) => {
  const { id, title, itemTypeId } = route?.params;
  const [loading, setLoading] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventVolunteersData, setEventVolunteersData] = useState<[]>([]);
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
  useEffect(() => {
    handlefetchEvents;
  }, []);
  const dispatch = useDispatch();
  const handlefetchEvents = async (index: any) => {
    const res = await dispatch(allEvents({} as any) as any);
    const volunteers = res?.payload?.foodEvents;
    console.log("volunteers", volunteers)
    const volunteerdata = volunteers?.filter(
      (event: any) => event?.id == id
    );
    setEventVolunteersData(volunteerdata);
  };
  console.log("volunteersDataa", eventVolunteersData)

  const eventDateTime = moment(selectedDate).utc().unix();
  const eventEndDateTime = moment(selectedEndDate).utc().unix();
  const [minmumEndDate, setMinmumEndDate] = useState<Date | any>(
    moment().add(1, "hour")
  );
  const [selectedEndTime, setSelectedEndTime] = useState<Date | any>(
    moment(new Date(selectedTime)).add(1, "hour")
  );
  const phoneInput = useRef<PhoneInput>(null);

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

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
    console.log("datepicker false", showDatePicker);
  };

  const handleEndDateChange = (endDate: any) => {
    console.log("checking selected end date", endDate);
    if (moment(endDate).isBefore(moment(selectedDate).add(1, "hour"))) {
      Alert.alert(
        "Alert",
        `You can't select a time before ${moment(selectedDate)
          .add(1, "hour")
          .format("MMM DD, YYYY hh:mm A")}`
      );
    } else {
      setSelectedEndDate(endDate);
    }
    setShowEndDatePicker(false);
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
      if (res) {
        navigation.navigate("MapScreen", {
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
              <View>
                <TextInput
                  placeholder={itemTypeId == 1 ? "Food Item" : "Supplies List"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                  editable={false}
                />
                <TextInput
                  placeholder={itemTypeId == 1 ? "Food Item" : "Supplies List"}
                  placeholderTextColor={"black"}
                  style={styles.textInput}
                  editable={false}
                />
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
                      placeholder={"State"}
                      placeholderTextColor={"black"}
                      style={[styles.textInput, { backgroundColor: "#deddd9" }]}
                      editable={false}
                    />
                  </View>
                </View>
                <View>
                  <TextInput
                    placeholder={"Zip Code"}
                    placeholderTextColor={"black"}
                    editable={false}
                    style={[styles.textInput]}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
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
                        }}
                      >
                        {moment(selectedDate).format("MMM, DD, YYYY")}
                      </Text>
                    </View>
                  </View>
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
                        {moment(selectedDate).format("hh:mm A")}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
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
                        {moment(selectedEndDate).format("MMM DD, YYYY")}
                      </Text>
                    </View>
                  </View>
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
                        {moment(selectedEndDate).format("hh:mm A")}
                      </Text>
                    </View>
                  </View>
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
                    placeholder={"Phone Number"}
                    containerStyle={[
                      styles.textArea,
                      {
                        width: "100%",
                        alignContent: "center",
                        justifyContent: "center",
                      },
                    ]}
                    textInputProps={{ placeholderTextColor: "black" }}
                    textInputStyle={{}}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default AllVolunteersScreen;
