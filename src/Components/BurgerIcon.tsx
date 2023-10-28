import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { styles } from "./Styles";
import { localized } from "../locales/localization";

const BurgerIcon = ({ menuClose, onOutsidePress }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  let [menutoggle, setToggle] = useState(menuClose);
  const navigation: any = useNavigation();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  menutoggle = menuClose;

  console.log("kvndsnvdsnvkds", menuClose, menutoggle);

  const handleMenuItemPress = () => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };
  const findFoodMenuItemPress = () => {
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
      {menuOpen && menutoggle && (
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
          {/* <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
            <Text style={styles.burgerText}>{localized.t("HOME")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => findFoodMenuItemPress("Find Food")}>
            <Text style={styles.burgerText}>{localized.t("FIND_FOOD")}</Text>
          </TouchableOpacity> */}
          {isAuthenticated && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("HistoryScreen");
                  setMenuOpen(false);
                }}
              >
                <Text style={styles.burgerText}>{localized.t("HISTORY")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TeamHomeScreen");
                  setMenuOpen(false);
                }}
              >
                <Text style={styles.burgerText}>{localized.t("TEAM")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProfileScreen");
                  setMenuOpen(false);
                }}
              >
                <Text style={styles.burgerText}>{localized.t("ACCOUNT")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default BurgerIcon;
