import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { calendarEvent } from "../redux/actions/calendarEventAction";

const CalendarScreen = ({ route }: any) => {
  const { latitude, longitude } = route?.params;
  const navigation: any = useNavigation();

  const [menuClose, setMenuOpen] = useState(false);
  const [date, setDate] = useState<any>();

  const dispatch = useDispatch();

  const selectedDate = new Date(date);

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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
                  <Text style={styles.itemText}>
                    {localized.t("MY_CALENDAR")}
                  </Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View
                style={[
                  styles.calendarView,
                  {
                    marginTop: h2dp(7),
                  },
                ]}
              >
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

                      const selectedDate = new Date(day.dateString);

                      const startDate = moment(selectedDate).utc().unix();
                      const endDate = moment(selectedDate)
                        .add(23.99, "hour")
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
                          singleDayEvent: response?.payload?.foodEvents,
                          latitude: latitude,
                          longitude: longitude,
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
