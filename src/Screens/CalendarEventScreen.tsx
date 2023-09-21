import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import moment from "moment";

const CalendarEventScreen = ({ route }: any) => {
  const navigation: any = useNavigation();

  const { selectedDate, singleDayEvent } = route.params;

  const formattedDate = moment(selectedDate).format("DD MMM");
  const monthHeader = moment(selectedDate).format("MMM");

  const [menuOpen, setMenuOpen] = useState(false);

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

  const navigateToDetailScreen = () => {
    navigation.navigate("CalendarEventDetailScreen", {
      eventDetails: singleDayEvent,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#012e17", "#017439", "#009b4d"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.row}>
            <View style={styles.dropdownContainer}></View>
            <View style={styles.item}>
              {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
              <Text style={styles.itemText}>Food Events</Text>
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
            </View>
          </View>

          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={26}
                  color="white"
                />
                <Text
                  style={{ color: "white", fontSize: h2dp(2), marginTop: 2 }}
                >
                  {monthHeader}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={26}
                  color="white"
                />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                marginLeft: w2dp(1),
                fontSize: h2dp(2),
              }}
            >
              Events
            </Text>
          </View>
          <ScrollView>
            <View style={styles.eventsContainer}>
              <View style={styles.dateContainer}>
                {singleDayEvent.map((event: any, index: any) => (
                  <Text key={index} style={styles.date}>
                    {formattedDate}
                  </Text>
                ))}
              </View>
              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "white",
                    // height: "1000%",
                    height :Platform.OS=== "ios"?"1000%":h2dp(100),
                    width: w2dp(0.5),
                    marginTop: 10,
                    marginLeft: w2dp(2),
                  }}
                ></View>
              </TouchableOpacity>
              <View style={styles.eventName}>
                {singleDayEvent.map((event: any, index: any) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("CalendarEventDetailScreen", {
                        eventDetails: event,
                      })
                    }
                  >
                    <View style={styles.eventCon}>
                      <Text style={styles.eventTitle}>{event?.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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
  subHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: w2dp(1),
  },
  eventsContainer: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "flex-start",
    marginBottom: h2dp(7),
  },
  eventCon: {
    backgroundColor: "white",
    height: h2dp(5),
    width: w2dp(60),
    marginTop: h2dp(2),
    marginLeft: w2dp(5),
    borderRadius: 5,
  },
  dateContainer: {
    display: "flex",
    marginTop: h2dp(4),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 32,
  },
  date: {
    color: "white",
    // // alignSelf: "center",
    // marginTop:h2dp(2)
    // backgroundColor: "white",
    height: h2dp(7),
    // width: w2dp(60),
    // marginTop: h2dp(2),
    marginLeft: w2dp(5),
    borderRadius: 5,
  },
  eventTitle: {
    marginTop: h2dp(1.5),
    fontSize: h2dp(2),
    marginLeft: w2dp(2),
  },
  eventName: {
    display: "flex",
    justifyContent: "flex-start",
    // borderWidth:3,
    width: w2dp(80),
    height: "100%",
  },
});

export default CalendarEventScreen;
