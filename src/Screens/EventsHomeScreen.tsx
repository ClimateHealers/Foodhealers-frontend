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
  View
} from "react-native";
import { Image } from "react-native-elements";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";

const EventsHomeScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [langOpen, setlangOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "Bengali", value: "be" },
    { id: 2, label: "Chinese", value: "ch" },
    { id: 3, label: "English", value: "en" },
    { id: 4, label: "French", value: "fr" },
    { id: 5, label: "Hindi", value: "hi" },
    { id: 6, label: "Mandarin", value: "ma" },
    { id: 7, label: "Punjabi", value: "pu" },
    { id: 8, label: "Spanish", value: "es" },
  ])

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };

  const navigation: any = useNavigation<string>();

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

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
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                  <Text style={styles.itemText}>Events</Text>
                </View>
                <BurgerIcon />
              </View>
              <View style={{ marginTop: h2dp(1) }}>
                <Image
                  source={require("../../assets/images/shutterShock.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PostEvent")}
                  >
                    <Text style={styles.textStyle}>Post an event</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: h2dp(5) }}>
                <Image
                  source={require("../../assets/images/allEvents.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AllEventScreen")}
                  >
                    <Text style={styles.textStyle}>See all events</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EventsHomeScreen;
