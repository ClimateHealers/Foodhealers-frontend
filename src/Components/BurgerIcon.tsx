import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { styles } from "./Styles";
import { localized } from "../locales/localization";

const BurgerIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation: any = useNavigation();
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
      {/* <TouchableWithoutFeedback
        onPress={() => {
          setMenuOpen(!menuOpen);
        }}
      > */}
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
            right: 40,
            top: 65,
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 0.5,
            borderRadius: 5,
            zIndex: 1,
          }}
        >
          <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
            <Text style={styles.burgerText}>{localized.t("HOME")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => findFoodMenuItemPress("Find Food")}>
            <Text style={styles.burgerText}>{localized.t("FIND_FOOD")}</Text>
          </TouchableOpacity>
          {isAuthenticated && (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
            >
              <Text style={styles.burgerText}>{localized.t("ACCOUNT")}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* </TouchableWithoutFeedback> */}
    </>
  );
};

export default BurgerIcon;
