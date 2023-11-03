import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { styles } from "./Styles";
import { localized } from "../locales/localization";

const BurgerIcon = ({ menuClose, onOutsidePress, menuItem }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation: any = useNavigation();
  let [menutoggle, setToggle] = useState(menuClose);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <MaterialCommunityIcons
        name="menu"
        size={40}
        color="white"
        onPress={() => toggleMenu()}
        style={{
          zIndex: 9999,
          right: 0,
        }}
      />
      {menuOpen && (
        <View
          style={{
            position: "absolute",
            right: w2dp(8.5),
            top: h2dp(5.5),
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 0.5,
            borderRadius: 5,
            zIndex: 1,
            flex: 2,
          }}
        >
          <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
            <Text style={styles.burgerText}>{localized.t("HOME")}</Text>
          </TouchableOpacity>
          {menuItem !== "Find Food" ? (
            <TouchableOpacity
              onPress={() => findFoodMenuItemPress("Find Food")}
            >
              <Text style={styles.burgerText}>{localized.t("FIND_FOOD")}</Text>
            </TouchableOpacity>
          ) : null}

          {isAuthenticated && (
            <View>
              {menuItem !== "History" ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("HistoryScreen");
                    setMenuOpen(false);
                  }}
                >
                  <Text style={styles.burgerText}>
                    {localized.t("HISTORY")}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {menuItem !== "Team" ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TeamHomeScreen");
                    setMenuOpen(false);
                  }}
                >
                  <Text style={styles.burgerText}>{localized.t("TEAM")}</Text>
                </TouchableOpacity>
              ) : null}
              {menuItem !== "Account" ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ProfileScreen");
                    setMenuOpen(false);
                  }}
                >
                  <Text style={styles.burgerText}>
                    {localized.t("ACCOUNT")}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default BurgerIcon;