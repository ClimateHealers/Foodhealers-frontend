import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";

const EventsHomeScreen = () => {
  const [menuClose, setMenuOpen] = useState(false);
  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const navigation: any = useNavigation<string>();

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.navigate("HomeScreen")}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{localized.t("EVENTS")}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("PostEvent")}
              >
                <View style={{ marginTop: h2dp(1) }}>
                  <Image
                    source={require("../../assets/images/shutterShock.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <Text style={styles.textStyle}>
                      {localized.t("POST_AN_EVENT")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllEventScreen")}
              >
                <View style={{ marginTop: h2dp(5) }}>
                  <Image
                    source={require("../../assets/images/allEvents.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <Text style={styles.textStyle}>
                      {localized.t("SEE_ALL_EVENTS")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EventsHomeScreen;
