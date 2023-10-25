import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import DonationTabScreen from "./DonationTabScreen";
import VolunteerTabScreen from "./VolunteerTabScreen";
import { Ionicons } from "@expo/vector-icons";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import RequestHistoryTabScreen from "./RequestHistoryTabScreen";
import DonationHistoryTabScreen from "./DonationHistoryTabScreen";

const HistoryScreen = ({ route }: any) => {
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(false);

  const [langOpen, setlangOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "French", value: "fr" },
    { id: 2, label: "Hindi", value: "hi" },
    { id: 3, label: "Bengali", value: "be" },
    { id: 4, label: "Chinese", value: "ch" },
    { id: 5, label: "Mandarin", value: "ma" },
    { id: 6, label: "Punjabi", value: "pu" },
    { id: 7, label: "English", value: "en" },
    { id: 8, label: "Spanish", value: "es" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };

  const FirstRoute = () => <DonationHistoryTabScreen />;

  const SecondRoute = () => <RequestHistoryTabScreen />;
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: `${localized.t("DONATIONS")}` },
    { key: "second", title: `${localized.t("REQUESTS")}` },
  ]);

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <View style={styles.container}>
          <FoodhealersHeader />
          <SafeAreaView>
            <View>
              <View style={styles.row}>
                <View style={styles.item}>
                  <Ionicons
                    name="chevron-back"
                    size={32}
                    color="white"
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={[styles.itemText, { marginTop: h2dp(-0.5) }]}>
                    {localized.t("HISTORY")}
                  </Text>
                </View>
                <BurgerIcon />
              </View>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={{ flex: 1 }}
                renderTabBar={(props) => (
                  <TabBar
                    {...props}
                    style={{ backgroundColor: "transparent" }}
                    labelStyle={styles.tabLabel}
                    indicatorStyle={styles.tabIndicator}
                  />
                )}
              />
            </View>
          </SafeAreaView>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: w2dp(4),
    marginTop: h2dp(3),
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: w2dp(95),
    zIndex: 9999,
  },
  item: {
    height: h2dp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginTop: h2dp(3),
  },
  card: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: h2dp(3),
    marginBottom: 10,
    height: h2dp(70),
    alignSelf: "center",
  },
  titleStyle: {
    color: "white",
    fontSize: 26,

    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  cardTextConainer: {
    marginTop: 30,
  },
  cardText: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "OpenSans-Light",
  },
  boldText: {
    fontWeight: "300",
    fontSize: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    bottom: 0,
    height: h2dp(10),
  },
  description: {
    marginTop: h2dp(3),
    display: "flex",
    justifyContent: "space-around",
  },
  tabLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabIndicator: {
    backgroundColor: "white",
    height: 2,
  },
  flatListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemStyle: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 16,
  },
});

export default HistoryScreen;
