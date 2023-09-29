import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";
import FoodhealersHeader from "../Components/FoodhealersHeader";
const CategoryScreen = ({ route }: any) => {
  const { categoryId, recipeName } = route.params;

  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [textChange, setTextChange] = useState(false);

  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );
  const fetchRecipesCategory = async () => {
    try {
      const recipeData = await dispatch(
        VeganRecipesCategory(categoryId) as any
      );
      setData(recipeData?.payload?.results?.recipeList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipesCategory();
  }, []);

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


  const handleSearchTextChange = (text: any) => {
    setSearchText(text);
    setTextChange(true);
    const filtered = data?.filter((item: any) =>
      item?.foodName?.toLowerCase()?.includes(text?.toLowerCase())
    );
    setFilteredData(filtered);
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <LinearGradient
          colors={["#012e17", "#017439", "#009b4d"]}
          style={styles.background}
        >
          <SafeAreaView style={styles.container}>
            <FoodhealersHeader/>
            <View style={styles.row}>
            <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <View style={styles.dropdownContainer}></View>
              <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.item, {alignItems: "center"}]}>
                <Text style={styles.itemText}>{recipeName}</Text>
              </View>
              </ScrollView>
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
            <View style={styles.inputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#000"
                value={searchText}
                onChangeText={handleSearchTextChange}
              />
            </View>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={[styles.centeredView]}>
                {textChange
                  ? filteredData?.map((recipe: any) => (
                      <TouchableOpacity
                        style={[styles.touchableView]}
                        key={recipe?.id}
                        onPress={() =>
                            navigation.navigate("SingleRecipeScreen", {
                              recipeData: {
                                recipeImage: recipe?.foodImage,
                                recipeIngredient: recipe?.ingredients,
                                recipeName: recipe?.foodName,
                                recipeInstructions: recipe?.cookingInstructions,
                              },
                            })
                          }
                      >
                        <View style={styles.cardContainer}>
                          <Image
                            source={{ uri: recipe?.foodImage }}
                            style={styles.imageStyle}
                          />
                          <View style={styles.heading}>
                            <Text
                              style={{
                                fontSize: h2dp(1.7),
                                fontWeight: "600",
                                marginBottom: h2dp(3),
                                marginTop: h2dp(1),
                                width: h2dp(10),
                              }}
                            >
                              {recipe?.foodName}
                            </Text>
                            <View style={styles.timerIcon}>
                              <Ionicons
                                name="ios-time-outline"
                                size={20}
                                color="#8A8686"
                              />
                              <Text style={{ marginLeft: 4, color: "#8A8686" }}>
                              {recipe?.preparationTime === "preparation time not specified" ? "Not specified" :recipe?.preparationTime}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  : data?.map((recipe: any) => (
                      <TouchableOpacity
                        style={[styles.touchableView]}
                        key={recipe?.id}
                        onPress={() =>
                            navigation.navigate("SingleRecipeScreen", {
                              recipeData: {
                                recipeImage: recipe?.foodImage,
                                recipeIngredient: recipe?.ingredients,
                                recipeName: recipe?.foodName,
                                recipeInstructions: recipe?.cookingInstructions,
                                cookingTime : recipe?.preparationTime,
                                recipeSource : recipe?.recipeSource,
                                recipeCredits: recipe?.recipeCredits
                              },
                            })
                          }
                      >
                        <View style={styles.cardContainer}>
                          <Image
                            source={{ uri: recipe?.foodImage }}
                            style={styles.imageStyle}
                          />
                          <View style={styles.heading}>
                            <Text
                              style={{
                                fontSize: h2dp(1.7),
                                fontWeight: "600",
                                marginBottom: h2dp(3),
                                marginTop: h2dp(1),
                                width: h2dp(18),
                              }}
                            >
                              {recipe?.foodName}
                            </Text>
                            <View style={styles.timerIcon}>
                              <Ionicons
                                name="ios-time-outline"
                                size={20}
                                color="#8A8686"
                              />
                              <Text style={{ marginLeft: 4, color: "#8A8686" }}>
                              {recipe?.preparationTime === "preparation time not specified" ? "Not specified" :recipe?.preparationTime}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
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
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: w2dp(40),
    // height : h2dp(13)
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
  input: {
    flex: 1,
    paddingVertical: 10,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: w2dp(86),
    height: h2dp(6),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  icon: {
    paddingHorizontal: 10,
  },
  touchableView: {
    borderRadius: 15,
    marginTop: h2dp(4),
    width: "85%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: w2dp(4),
  },
  timerIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: h2dp(2),
  },
});

export default CategoryScreen;
