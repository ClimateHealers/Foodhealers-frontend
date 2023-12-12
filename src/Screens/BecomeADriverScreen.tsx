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
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ flex: 1, alignItems: "center", marginTop: h2dp(2) }}>
              <FoodhealersHeader />
              <View
                style={[
                  styles.rootVolunteerHome,
                  {
                    marginBottom: h2dp(4),
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => {navigation.goBack(),handlePressOutside()}}
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
                style={{
                  backgroundColor: "white",
                  marginBottom: 10,
                  width: "100%",
                  height: h2dp(30),
                }}
              >
                <Image
                  source={require("../../assets/images/shutterstock_1907968996.png")}
                  style={{ width: "100%", height: h2dp(30) }}
                />
              </View>
              <View>
                <PrimaryButton
                  title={localized.t("BECOME_A_DRIVER_FOR_FOOD_HEALERS")} // {localized.t(// )}
                  onPress={() => {navigation.navigate("AddDriverScreen"),handlePressOutside()}}
                  buttonStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 10,
                    paddingVertical: h2dp(2),
                    paddingHorizontal: w2dp(10),
                    justifyContent: "center",
                    width: w2dp(70),
                    marginTop: h2dp(7),
                  }}
                  titleStyle={styles.titleMainStyle}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default BecomeADriverScreen;
