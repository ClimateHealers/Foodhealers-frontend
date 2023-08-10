import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { widthPercentageToDP as wp2dp } from "react-native-responsive-screen";
import { material, systemWeights } from "react-native-typography";
import { useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { getLocation } from "../Components/getCurrentLocation";
// import ViolationFlatlist from "./components/ViolationFlatlist";
// import { elogLogger } from "../util/helper/logger";

export default function NotificationScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  //   const getNotifications = useSelector(
  //     (state) => state.profileReducer.notificationList,
  //   );

  //   elogLogger.info('total notifications', getNotifications)

  const navigation: any = useNavigation();

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.row}>
          <Ionicons
            name="chevron-back"
            size={32}
            color="white"
            style={{ marginRight: w2dp(15), marginTop: h2dp(3), }}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.itemText}>{"Notifications"}</Text>
        </View>
        <View style={styles.bgimage}>
          {
            //   getNotifications.success ? (
            //     <ViolationFlatlist data={getNotifications?.data} />
            //   ) :
            <View style={styles.textContainer}>
              <Text
                style={{
                  ...systemWeights.bold,
                  color: "white",
                }}
              >
                Coming Soon!
              </Text>
            </View>
          }
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  bgimage: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: wp2dp("2.5"),
    paddingBottom: 20,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingTop: Platform?.OS == "ios" ? 5 : 0,
  },

  textContainer: {
    top: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    marginLeft: 30,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginTop: h2dp(3),
  },
});
