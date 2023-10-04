import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import moment from "moment";
import { calendarEvent } from "../redux/actions/calendarEventAction";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import BurgerIcon from "../Components/BurgerIcon";
import { localized } from "../locales/localization";

const CalendarScreen = ({ route }: any) => {
  const navigation: any = useNavigation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [date, setDate] = useState<any>();

  const dispatch = useDispatch();

  const selectedDate = new Date(date);

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((location: any) => {
      if (location) {
        navigation?.navigate("MapScreen", {
          location: location,
        });
      }
    });
    setMenuOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#012e17", "#017439", "#009b4d"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="always">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                  <Text style={styles.itemText}>{localized.t("My Calendar")}</Text>
                </View>
                  <BurgerIcon />
              </View>
              <View style={styles.calendarView}>
                <Calendar
                  enableSwipeMonths={true}
                  headerStyle={{
                    backgroundColor: "white",
                  }}
                  style={{
                    borderRadius: 10,
                  }}
                  markedDates={{
                    [date]: {
                      selected: true,
                      selectedColor: "green",
                      disableTouchEvent: true,
                      selectedTextColor: "white",
                    },
                  }}
                  onDayPress={async (day) => {
                    try {
                      setDate(day.dateString);

                      const selectedDate = new Date(day.dateString); // Parse the selected date

                      const startDate = moment(selectedDate)
                        .startOf("day")
                        .utc()
                        .unix();
                      const endDate = moment(selectedDate)
                        .endOf("day")
                        .utc()
                        .unix();

                      const payloadData = {
                        startDate: startDate,
                        endDate: endDate,
                      };

                      const response = await dispatch(
                        calendarEvent(payloadData as any) as any
                      );

                      if (response?.payload?.foodEvents) {
                        navigation.navigate("CalendarEventScreen", {
                          selectedDate: day.dateString,
                          singleDayEvent: response.payload.foodEvents,
                        });
                      } else {
                      }
                    } catch (error) {
                      console.error("Error:", error);
                    }
                  }}
                  theme={{
                    calendarBackground: "#ffffff",
                    todayTextColor: "red",
                    dayTextColor: "green",
                    textDisabledColor: "black",
                    monthTextColor: "green",
                    indicatorColor: "blue",
                    textDayFontFamily: "monospace",
                    textMonthFontFamily: "monospace",
                    textDayHeaderFontFamily: "monospace",
                    arrowColor: "green",
                    textMonthFontSize: 20,
                    selectedDotColor: "red",
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default CalendarScreen;
