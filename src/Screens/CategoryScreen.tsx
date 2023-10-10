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
import { styles } from "../Components/Styles";
import BurgerIcon from "../Components/BurgerIcon";
import { localized } from "../locales/localization";
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
          <SafeAreaView style={styles.containerVolunteer}>
            <FoodhealersHeader />
            <View style={styles.rootVolunteerHome}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <View style={styles.dropdownContainer}></View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.item, { alignItems: "center" }]}>
                  <Text style={styles.itemText}>{recipeName}</Text>
                </View>
              </ScrollView>
              <BurgerIcon />
            </View>
            <View
              style={[
                styles.inputContainer,
                {
                  marginBottom: h2dp(3),
                },
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <TextInput
                style={{ flex: 1, paddingVertical: 10, color: "#000" }}
                placeholder="Search"
                placeholderTextColor="#000"
                value={searchText}
                onChangeText={handleSearchTextChange}
              />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={[styles.centeredView]}>
                  {textChange
                    ? filteredData?.map((recipe: any) => (
                        <View
                          key={recipe?.id}
                          style={{
                            marginBottom: h2dp(3),
                            position: "relative",
                          }}
                        >
                          <Image
                            source={{ uri: recipe?.foodImage }}
                            style={[styles.imageStyle,{
                              height: h2dp(20)
                            }]}
                          />
                          <View style={styles.title}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SingleRecipeScreen", {
                                  recipeData: {
                                    recipeImage: recipe?.foodImage,
                                    recipeIngredient: recipe?.ingredients,
                                    recipeName: recipe?.foodName,
                                    recipeInstructions:
                                      recipe?.cookingInstructions,
                                  },
                                })
                              }
                            >
                              <Text style={styles.textStyle}>
                                {recipe?.foodName}
                              </Text>
                              <View style={styles.timerIcon}>
                                <Ionicons
                                  name="ios-time-outline"
                                  size={20}
                                  color="#8A8686"
                                />
                                <Text
                                  style={{ marginLeft: 4, color: "#8A8686" }}
                                >
                                  {recipe?.preparationTime ===
                                  "preparation time not specified"
                                    ? `${localized.t("NOT_SPECIFIED")}`
                                    : recipe?.preparationTime}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    : data?.map((recipe: any) => (
                        <View
                          style={{
                            marginBottom: h2dp(3),
                            position: "relative",
                          }}
                          key={recipe?.id}
                        >
                          <Image
                            source={{ uri: recipe?.foodImage }}
                            style={[styles.imageStyle,{
                              height: h2dp(20)
                            }]}
                          />
                          <View style={styles.title}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SingleRecipeScreen", {
                                  recipeData: {
                                    recipeImage: recipe?.foodImage,
                                    recipeIngredient: recipe?.ingredients,
                                    recipeName: recipe?.foodName,
                                    recipeInstructions:
                                      recipe?.cookingInstructions,
                                    cookingTime: recipe?.preparationTime,
                                    recipeSource: recipe?.recipeSource,
                                    recipeCredits: recipe?.recipeCredits,
                                  },
                                })
                              }
                            >
                              <Text style={styles.textStyle}>
                                {recipe?.foodName}
                              </Text>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Ionicons
                                  name="ios-time-outline"
                                  size={20}
                                  color="#8A8686"
                                />
                                <Text
                                  style={{ marginLeft: 4, color: "#8A8686" }}
                                >
                                  {recipe?.preparationTime ===
                                  "preparation time not specified"
                                    ? `${localized.t("NOT_SPECIFIED")}`
                                    : recipe?.preparationTime}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CategoryScreen;
