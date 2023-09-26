import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";
import BurgerIcon from "../Components/BurgerIcon";
import PrimaryButton from "../Components/PrimaryButton";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { useSelector } from "react-redux";

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
      <View style={styles.container}>
        <LinearGradient
          colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
          style={styles.background}
        >
          <SafeAreaView>
            <View style={styles.row}>
              <Text style={styles.itemText}>{title}</Text>
              <View style={styles.item}>
                <BurgerIcon />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: 70,
                      backgroundColor: "white",
                      borderColor: "white",
                      height: 100,
                      borderRadius: 5,
                      zIndex: 9999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => findFoodMenuItemPress("Find Food")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Find Food
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View>
              <View style={[styles.card, { backgroundColor: "white" }]}>
                <View style={styles.description}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(3.2),
                      fontWeight: "500",
                      marginTop: h2dp(3),
                    }}
                  >
                    Confirmed
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(3.2),
                      fontWeight: "500",
                    }}
                  >
                    Thank you ! {data?.user?.name}
                  </Text>
                </View>
                <View style={styles.description}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: h2dp(2.8),
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
                          fontSize: h2dp(2.8),
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
                    titleStyle={styles.titleStyle}
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
                    titleStyle={styles.titleStyle}
                  />
                ) : (
                  <PrimaryButton
                    title={"Volunteer another event"}
                    onPress={() =>
                      navigation.navigate("VolunteerEventScreen", {
                        itemTypeId: itemTypeId,
                        id: id,
                        title: title,
                      })
                    }
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                  />
                )}
                </View>
                <View>
                  {itemTypeId === 3 ?(
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
                    titleStyle={styles.titleStyle}
                  />
                  ):(<PrimaryButton
                    title={"History"}
                    onPress={() =>
                      navigation.navigate("VolunteerDonationHistoryScreen", {
                        itemTypeId: itemTypeId,
                        title: title,
                        id: id,
                      })
                    }
                    buttonStyle={styles.buttonHistoryStyles}
                    titleStyle={styles.titleStyle}
                  />)}
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    marginLeft: 30,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginTop: h2dp(3),
  },
  card: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: h2dp(3),
    marginTop: h2dp(8),
    marginBottom: 10,
    height: h2dp(40),
    alignSelf: "center",
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 300,
    marginTop: h2dp(6.5),
    alignSelf: "center",
  },
  buttonHistoryStyles: {
    backgroundColor: "#FFFFFF",
    color: "black",
    borderRadius: 5,
    width: 300,
    marginTop: h2dp(3),
    alignSelf: "center",
  },
  buttonMainStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 300,
    marginTop: h2dp(5),
    alignSelf: "center",
  },
  titleStyle: {
    color: "black",
    fontSize: 26,

    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  titleMainStyle: {
    color: "black",
    fontSize: 26,

    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  cardTextConainer: {
    marginTop: 30,
  },
  cardText: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "OpenSans-Light",
  },
  boldText: {
    fontWeight: "300",
    fontSize: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    bottom: 0,
    height: h2dp(10),
  },
  description: {
    marginTop: h2dp(3),
    marginLeft: h2dp(2),
    marginRight: h2dp(2),
    display: "flex",
    justifyContent: "space-around",
  },
});

export default VolunteerThankYouScreen;
