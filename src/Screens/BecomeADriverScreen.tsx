import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";

const BecomeADriverScreen = () => {
  const navigation: any = useNavigation();
  const [menuClose, setMenuOpen] = useState(false);

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ flex: 1 }}
            >
              <FoodhealersHeader />
              <View style={styles.root}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => {
                    navigation.goBack(), handlePressOutside();
                  }}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{localized.t("DRIVE")}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View
                style={[
                  styles.centeredView,
                  {
                    height: h2dp(60),
                  },
                ]}
              >
                <Image
                  source={require("../../assets/images/shutterstock_1907968996.png")}
                  style={{ width: "100%", height: h2dp(30), borderRadius: 10 }}
                />
              </View>
            </ScrollView>
              <View
                style={{
                  paddingBottom: h2dp(2),
                }}
              >
                <PrimaryButton
                  title={localized.t("BECOME_A_DRIVER_FOR_FOOD_HEALERS")}
                  onPress={() => {
                    navigation.navigate("AddDriverScreen"), handlePressOutside();
                  }}
                  buttonStyle={[
                    styles.buttonStyles,
                    {
                      marginHorizontal: 0,
                    },
                  ]}
                  titleStyle={styles.titleStyle}
                />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default BecomeADriverScreen;
