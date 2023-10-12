import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";

const VolunteerThankYouScreen = ({ route }: any) => {
  const { id, itemTypeId, title, latitude, longitude } = route?.params;
  const userDetails = useSelector((state: any) => state.auth);
  const navigation: any = useNavigation();
  const { data } = userDetails;

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePressOutside = () => {
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

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.navigate("VolunteerHomeScreen", {
                    latitude: latitude,
                    longitude: longitude,
                  })}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{title}</Text>
                </View>
                <BurgerIcon />
              </View>
              <View
                style={[
                  styles.cardText,
                  { backgroundColor: "white", paddingHorizontal: w2dp(5) },
                ]}
              >
                <View
                  style={[styles.description, { paddingVertical: w2dp(5) }]}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(2.8),
                      fontWeight: "400",
                      marginTop: h2dp(3),
                    }}
                  >
                    {localized.t("CONFIRMED")}
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(2.8),
                      fontWeight: "400",
                    }}
                  >
                    {localized.t("THANK_YOU")} {data?.user?.name}
                  </Text>
                </View>
                <View style={styles.description}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(2.4),
                      textAlign: "center",
                    }}
                  >
                    {itemTypeId === 3 ? (
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: h2dp(2.8),
                          textAlign: "center",
                        }}
                      >
                        {localized.t("THANK_YOU_FOR_BEING_EVENT_VOLUNTEER")}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: h2dp(2.4),
                          textAlign: "center",
                        }}
                      >
                        {localized.t("A_FOODHEALER_TEAM_MEMBER_IN_TOUCH")}
                      </Text>
                    )}
                  </Text>
                  <PrimaryButton
                    title={localized.t("HOME")}
                    onPress={() => navigation.navigate("VolunteerHomeScreen", {
                      latitude: latitude,
                      longitude: longitude,
                    })}
                    buttonStyle={styles.buttonMainStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                </View>
              </View>
              <View>
                {itemTypeId === 1 ? (
                  <PrimaryButton
                    title={localized.t("ADD_ANOTHER_DONATION")}
                    onPress={() =>
                      navigation.navigate("AddDonationsScreen", {
                        itemTypeId: itemTypeId,
                        id: id,
                        title: title,
                      })
                    }
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                ) : itemTypeId === 2 ? (
                  <PrimaryButton
                    title={localized.t("ADD_ANOTHER_SUPPLIES")}
                    onPress={() =>
                      navigation.navigate("AddDonationsScreen", {
                        itemTypeId: itemTypeId,
                        id: id,
                        title: title,
                      })
                    }
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                ) : (
                  <PrimaryButton
                    title={localized.t("VOLUNTEER_AT_EVENT")}
                    onPress={() => {
                      navigation.navigate("VolunteerEventScreen", {
                        itemTypeId: itemTypeId,
                        id: id,
                        title: title,
                      });
                    }}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                )}
              </View>
              <View>
                {itemTypeId === 3 ? (
                  <PrimaryButton
                    title={localized.t("HISTORY")}
                    onPress={() =>
                      navigation.navigate("VolunteerEventHistoryScreen", {
                        itemTypeId: itemTypeId,
                        title: title,
                        id: id,
                      })
                    }
                    buttonStyle={styles.buttonHistoryStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                ) : (
                  <PrimaryButton
                    title={localized.t("HISTORY")}
                    onPress={() =>
                      navigation.navigate("VolunteerDonationHistoryScreen", {
                        itemTypeId: itemTypeId,
                        title: title,
                        id: id,
                      })
                    }
                    buttonStyle={styles.buttonHistoryStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerThankYouScreen;
