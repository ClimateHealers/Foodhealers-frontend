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
import { localized } from "../locales/localization";
import { getLocation } from "../Components/getCurrentLocation";
import { useSelector } from "react-redux";

const RecipesHomeScreen = () => {
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
          {/* <ScrollView keyboardShouldPersistTaps="always"> */}
            <SafeAreaView style={styles.container}>
              <View style={styles.row}>
                <View style={styles.dropdownContainer}></View>
                <View style={styles.item}>
                  {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                  <Text style={styles.itemText}>Recipes</Text>
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
                <View style={{ marginBottom: h2dp(3), position:"relative" }}>
                  <Image
                    source={require("../../assets/images/dinnerPicture.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PostEvent")}
                    >
                      <Text style={styles.textStyle}>Dinner</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginBottom: h2dp(3) }}>
                  <Image
                    source={require("../../assets/images/lunchPicture.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PostEvent")}
                    >
                      <Text style={styles.textStyle}>Lunch</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginBottom: h2dp(3) }}>
                  <Image
                    source={require("../../assets/images/breakfastPicture.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PostEvent")}
                    >
                      <Text style={styles.textStyle}>Breakfast</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginBottom: h2dp(3) }}>
                  <Image
                    source={require("../../assets/images/soupPicture.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PostEvent")}
                    >
                      <Text style={styles.textStyle}>Soup</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginBottom: h2dp(3) }}>
                  <Image
                    source={require("../../assets/images/appetizerPicture.png")}
                    style={styles.imageStyle}
                  />
                  <View style={styles.title}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PostEvent")}
                    >
                      <Text style={styles.textStyle}>Appetizers</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
							</ScrollView>
            </SafeAreaView>
          {/* </ScrollView> */}
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
    marginTop: h2dp(2),
  },
});

export default RecipesHomeScreen;
