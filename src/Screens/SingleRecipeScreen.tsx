import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";

const SingleRecipeScreen = ({ route }: any) => {
  const { recipeData } = route.params;


  const ingredients = recipeData?.recipeIngredient
    .replace(/\[|\]|'/g, "")
    .split(",");
  const instructions = recipeData?.recipeInstructions.replace(/\[|\]|'/g, "");

  const navigation: any = useNavigation();
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState<[]>([]);

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(false);
  };

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

  return (
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
              <Text style={styles.itemText}>{recipeData?.recipeName}</Text>
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
                  <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
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
            <View>
              <TouchableOpacity>
                <Image
                  source={{ uri: recipeData?.recipeImage }}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <View>
                  <Text
                    style={{
                      marginLeft: h2dp(2),
                      marginTop: h2dp(2),
                      color: "white",
                      fontSize: h2dp(3),
                    }}
                  >
                    Cooking time
                  </Text>
                  <View>
                    <View style={styles.timerIcon}>
                      <Ionicons
                        name="ios-time-outline"
                        size={20}
                        color="white"
                      />
                      <Text
                        style={{
                          marginLeft: 4,
                          color: "white",
                        }}
                      >
                        10 mins
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(3),
                      marginLeft: h2dp(2),
                      marginBottom: h2dp(2),
                    }}
                  >
                    Ingredients
                  </Text>
                  {ingredients.map((ingredient: any, index: any) => (
                    <Text key={index} style={styles.ingredient}>
                      {ingredient}
                    </Text>
                  ))}
                </View>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(3),
                      margin: h2dp(2),
                    }}
                  >
                    Instructions
                  </Text>
                  <Text style={styles.ingredient}>{instructions}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: h2dp("100%"),
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
    width: "35%",
    marginTop: 25,
    // height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: h2dp(3),
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
  mapContainer: {
    borderWidth: 1,
  },

  imageStyle: {
    alignSelf: "center",
    width: w2dp(90),
    height: h2dp(30),
  },
  ingredient: {
    marginBottom: 4,
    color: "white",
    marginLeft: h2dp(2),
    fontSize: h2dp(2),
  },
  timerIcon: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    marginLeft: h2dp(2),
    marginBottom: h2dp(2),
    marginTop: h2dp(1),
  },
});

export default SingleRecipeScreen;
