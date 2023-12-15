import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import {
  Alert,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getLocation } from "./GetCurrentLocation";
import { styles } from "./Styles";
import { localized } from "../locales/localization";

const BurgerIcon = ({ menuClose, onOutsidePress, menuItem }: any) => {
  const [menuOpen, setMenuOpen] = useState(menuClose);
  const navigation: any = useNavigation();
  const burgerRef = useRef<View>(null);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [menuClose]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Download this application from Google Play Store
        
        https://play.google.com/store/apps/details?id=com.foodhealers.climatehealers`,
        url: "https://play.google.com/store/apps/details?id=com.foodhealers.climatehealers",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

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
          zIndex: 2,
          right: 0,
        }}
      />
      {menuOpen && (
        <View
          ref={burgerRef}
          style={{
            position: "absolute",
            right: w2dp(8.5),
            top: h2dp(5.5),
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 0.5,
            borderRadius: 5,
            zIndex: 10,
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
              {Platform?.OS === "ios" ? null : (
                <TouchableOpacity onPress={() => onShare()}>
                  <Text style={styles.burgerText}>{localized.t("SHARE")}</Text>
                </TouchableOpacity>
              )}
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
