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

const VolunteerThankYouScreen = ({ route }: any) => {
  const { id, itemTypeId, title } = route?.params;
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
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {title}
                    jhbcdjajch
                  </Text>
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
                    Confirmed
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(2.8),
                      fontWeight: "400",
                    }}
                  >
                    Thank you ! {data?.user?.name}
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
                        Thank You for being event volunteer.
                      </Text>
                    ) : (
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: h2dp(2.4),
                          textAlign: "center",
                        }}
                      >
                        A Food Healer team member will be in touch.
                      </Text>
                    )}
                  </Text>
                  <PrimaryButton
                    title={"Home"}
                    onPress={() => navigation.navigate("VolunteerHomeScreen")}
                    buttonStyle={styles.buttonMainStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                </View>
              </View>
              <View>
                {itemTypeId === 1 ? (
                  <PrimaryButton
                    title={"Add another donation"}
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
                    title={"Add another supplies"}
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
                    title={"Volunteer another event"}
                    onPress={() =>
                      navigation.navigate("VolunteerEventScreen", {
                        // itemTypeId: itemTypeId,
                        // id: id,
                        // title: title,
                      })
                    }
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleMainStyle}
                  />
                )}
              </View>
              <View>
                {itemTypeId === 3 ? (
                  <PrimaryButton
                    title={"History"}
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
                    title={"History"}
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
