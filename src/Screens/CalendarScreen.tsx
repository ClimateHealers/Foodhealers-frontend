import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
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
        <ScrollView keyboardShouldPersistTaps="always">
          <SafeAreaView style={styles.container}>
            <View style={styles.row}>
              <View style={styles.dropdownContainer}></View>
              <View style={styles.item}>
                {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                <Text style={styles.itemText}>My calendar</Text>
              </View>
              <View style={styles.item}>
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="white"
                  onPress={() => toggleMenu()}
                />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: Platform.OS === "ios" ? h2dp(8) : h2dp(9),
                      backgroundColor: "white",
                      borderColor: "black",
                      borderWidth: 0.2,

                      borderRadius: 5,
                      zIndex: 9999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
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
              </View>
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
                onDayPress = {async (day) => {
                  try {
                    setDate(day.dateString);
                
                    const selectedDate = new Date(day.dateString); // Parse the selected date
                
                    const startDate = moment(selectedDate).startOf('day').utc().unix();
                    const endDate = moment(selectedDate).endOf('day').utc().unix();
                
                    const payloadData = {
                      startDate: startDate,
                      endDate: endDate,
                    };
                
                    console.log("Checking start and end date", payloadData);
                    const response = await dispatch(calendarEvent(payloadData as any) as any);
                
                    console.log("Response:", response);
                
                    if (response.payload.foodEvents) {
                      navigation.navigate("CalendarEventScreen", {
                        selectedDate: day.dateString,
                        singleDayEvent: response.payload.foodEvents,
                      });
                    } else {
                      console.log("No food events found in the response.");
                      // Handle the case where there are no food events
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    // Handle any errors that occur during the async operation
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
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: h2dp("100%"),
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
    width: "35%",
    marginTop: 25,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dropdownContainer: {
    marginTop: 15,
    marginLeft: 15,
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  mapContainer: {},
  dropdown1BtnStyle: {
    marginTop: 15,
    marginLeft: 45,
    width: "70%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdown1BtnTxtStyle: { color: "#B50000", textAlign: "left", fontSize: 14 },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    color: "black",
    borderRadius: 4,
    height: 180,
    fontSize: 14,
    borderColor: "blue",
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    color: "#B50000",
    borderBottomColor: "#D1D1D6",
    borderRadius: 5,
  },
  dropdown1RowTxtStyle: { color: "black", textAlign: "center", fontSize: 10 },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 190,
    alignSelf: "center",
  },

  titleStyle: {
    color: "white",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },

  blueDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.7)",
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  calendarView: {
    width: "80%",
    alignSelf: "center",
    marginTop: h2dp(10),
    // borderWidth:13,
    borderRadius: 10,
  },
});

export default CalendarScreen;
