import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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
import { getLocation } from "../Components/GetCurrentLocation";
import moment from "moment";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import BurgerIcon from "../Components/BurgerIcon";
import { localized } from "../locales/localization";

const CalendarEventScreen = ({ route }: any) => {
  const { latitude, longitude } = route?.params;
  const navigation: any = useNavigation();

  const { selectedDate, singleDayEvent } = route.params;

  const formattedDate = moment(selectedDate).format("DD MMM");
  const monthHeader = moment(selectedDate).format("MMM");

  const [menuClose, setMenuOpen] = useState(false);

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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
        <SafeAreaView
          style={[
            styles.container,
            { marginTop: h2dp(3), marginHorizontal: "4%" },
          ]}
        >
          <FoodhealersHeader />
          <View style={styles.row}>
            <Ionicons
              name="chevron-back"
              size={32}
              color="white"
              onPress={() => {
                navigation.goBack(), handlePressOutside();
              }}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>{localized.t("FOOD_EVENTS")}</Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>

          <View style={styles.subHeader}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack(), handlePressOutside();
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
              {localized.t("EVENTS")}
            </Text>
          </View>
          <ScrollView>
            <TouchableOpacity activeOpacity={1}>
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
                      height: Platform.OS === "ios" ? "1000%" : h2dp(100),
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
                      onPress={() => {
                        handlePressOutside(),
                          navigation.navigate("CalendarEventDetailScreen", {
                            eventDetails: event,
                            latitude: latitude,
                            longitude: longitude,
                          });
                      }}
                    >
                      <View style={styles.eventCon}>
                        <Text style={styles.eventTitle}>{event?.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
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
    fontSize: h2dp(2.5),
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
  dropdown1BtnTxtStyle: { color: "#B50000", textAlign: "left", fontSize: h2dp(1.4) },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    color: "black",
    borderRadius: 4,
    height: 180,
    fontSize: h2dp(1.4),
    borderColor: "blue",
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    color: "#B50000",
    borderBottomColor: "#D1D1D6",
    borderRadius: 5,
  },
  dropdown1RowTxtStyle: { color: "black", textAlign: "center", fontSize: h2dp(1.0) },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 190,
    alignSelf: "center",
  },

  titleStyle: {
    color: "white",
    fontSize: h2dp(2.6),
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
    marginBottom: h2dp(2),
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
    height: h2dp(7),
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
    width: w2dp(80),
  },
});

export default CalendarEventScreen;
