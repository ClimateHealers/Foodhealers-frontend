import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
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
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";

const VolunteerHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation: any = useNavigation();

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
    getLocation().then((location: any) => {
      if (location) {
        navigation?.navigate("MapScreen", {
          location: location,
        });
      }
    });
    setMenuOpen(false);
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(false);
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <LinearGradient
          colors={["#012e17", "#017439", "#009b4d"]}
          style={styles.background}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.row}>
              <View style={styles.dropdownContainer}></View>
              <View style={styles.item}>
                {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                <Text style={styles.itemText}>Home</Text>
              </View>
              <View style={styles.item}>
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="white"
                  onPress={() => toggleMenu()}
                />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: Platform.OS === "ios" ? h2dp(8) : h2dp(9),
                      backgroundColor: "white",
                      borderColor: "black",
                      borderWidth: 0.2,

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
                    {isAuthenticated && (
                      <TouchableOpacity
                        onPress={() => navigation.navigate("ProfileScreen")}
                      >
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 20,
                            fontWeight: "300",
                            lineHeight: 27.24,
                          }}
                        >
                          Account
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={[styles.centeredView]}>
                <View
                  style={{
                    marginBottom: h2dp(3),
                    position: "relative",
                  }}
                >
                  <Image
                    source={require("../../assets/images/shutterShock.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("CategoryScreen")}
                    >
                      <Text style={styles.textStyle}>Volunteer/Donate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    marginBottom: h2dp(3),
                    position: "relative",
                  }}
                >
                  <Image
                    source={require("../../assets/images/volunteerToDrive.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("CategoryScreen")}
                    >
                      <Text style={styles.textStyle}>Volunteer to Drive</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Text style={styles.subHeading}>Events</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: h2dp(3) }}
              >
                <View style={styles.horizonatalView}>
                  <View
                    style={{
                      marginLeft: w2dp(7),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/santMonica.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>Santa Monica</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: w2dp(5),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shutterShock.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>San franscisco</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <Text style={styles.subHeading}>Highlights</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: h2dp(3) }}
              >
                <View style={styles.horizonatalView}>
                  <View
                    style={{
                      marginLeft: w2dp(7),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/santMonica.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>New partners</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: w2dp(5),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shutterShock.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>climate</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <Text style={styles.subHeading}>Vegan Recipes</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: h2dp(3) }}
              >
                <View style={styles.horizonatalView}>
                  <View
                    style={{
                      marginLeft: w2dp(7),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/santMonica.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>Vegan wraps</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: w2dp(5),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shutterShock.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CategoryScreen")}
                      >
                        <Text style={styles.textStyle}>Vegan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity>
                <Image
                  source={require("../../assets/images/map.png")}
                  style={styles.mapImage}
                />
              </TouchableOpacity>
              <View style={{ marginVertical: h2dp(4) }}>
                <Text style={styles.mapContent}>15346</Text>
                <Text style={styles.mapContent}>Events Scheduled</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: h2dp("100%"),
    // marginBottom: h2dp(15),
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dropdownContainer: {
    marginTop: 15,
    marginLeft: 15,
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  imageStyle: {
    borderRadius: 10,
    width: w2dp(85),
    height: h2dp(15),
  },
  mapImage: {
    borderRadius: 10,
    width: w2dp(85),
    // height: h2dp(15),
    alignSelf: "center",
  },
  title: {
    backgroundColor: "white",
    opacity: 0.9,
    width: w2dp(85),
    // height: "20%",
    position: "absolute",
    bottom: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textStyle: {
    textAlign: "center",
    fontSize: 26,
    lineHeight: 35,
    fontWeight: "normal",
    fontStyle: "normal",
    marginTop: 13,
  },
  centeredView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: h2dp(2),
  },
  horizonatalView: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // marginTop: h2dp(2),
  },
  subHeading: {
    marginLeft: w2dp(7),
    marginBottom: h2dp(1.3),
    fontSize: h2dp(2),
    color: "white",
  },
  mapContent: {
    color: "white",
    fontSize: h2dp(2.5),
    alignSelf: "center",
  },
});

export default VolunteerHomeScreen;
