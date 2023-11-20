import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { decode } from "html-entities";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";
const CategoryScreen = ({ route }: any) => {
  const { categoryId, recipeName } = route.params;
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [recipeCat, setRecipeCat] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [textChange, setTextChange] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

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
      setRecipeCat(recipeData?.payload);
      setData(recipeData?.payload?.results?.recipeList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipesCategory();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setResponse({
        loading: true,
        message: "",
        error: false,
      });

      axios
        .get(`https://api.climatehealers.com/v1/api/recipe/2/?page=${page}`)
        .then((response) => {
          const newData = response?.data?.results?.recipeList;
          setData((prevData: any[]) => [
            ...prevData,
            ...response.data?.results?.recipeList,
          ]);
          setLoading(false);
          if (response.data.length > 0) {
            setData((prevData: any[]) => [
              ...prevData,
              ...JSON.stringify(response.data),
            ]);
            setPage(page + 1);
          } else {
            setHasMoreData(false);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (err: any) {
      setLoading(false);
      setResponse({
        loading: false,
        message: err.message,
        error: true,
      });
    }
    setLoading(false);
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
            <Modal visible={loading} animationType="slide" transparent={true}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ActivityIndicator size={"large"} />
                </View>
              </View>
            </Modal>
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
              showsVerticalScrollIndicator={false}
              onScroll={(e) => {
                const { layoutMeasurement, contentOffset, contentSize } =
                  e.nativeEvent;
                const isCloseToBottom =
                  layoutMeasurement?.height + contentOffset?.y >=
                  contentSize?.height - 70;

                if (isCloseToBottom) {
                  fetchData();
                }
              }}
              scrollEventThrottle={400}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={[styles.centeredalignView]}>
                  {textChange
                    ? filteredData?.map((recipe: any) => (
                        <TouchableOpacity
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
                          <View
                            key={recipe?.id}
                            style={{
                              marginBottom: h2dp(3),
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: recipe?.foodImage }}
                              style={[
                                styles.imageStyle,
                                {
                                  height: h2dp(20),
                                },
                              ]}
                            />
                            <View style={styles.title}>
                              <Text style={styles.textStyle}>
                                {recipe?.foodName?.length > 25
                                  ? `${decode(recipe?.foodName, {
                                      level: "html5",
                                    })?.slice(0, 20)}...`
                                  : decode(recipe?.foodName, {
                                      level: "html5",
                                    })}
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
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    : data?.map((recipe: any) => (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("SingleRecipeScreen", {
                              recipeData: {
                                recipeImage: recipe?.foodImage,
                                recipeIngredient: recipe?.ingredients,
                                recipeName: recipe?.foodName,
                                recipeInstructions: recipe?.cookingInstructions,
                                cookingTime: recipe?.preparationTime,
                                recipeSource: recipe?.recipeSource,
                                recipeCredits: recipe?.recipeCredits,
                              },
                            })
                          }
                        >
                          <View
                            style={{
                              marginBottom: h2dp(3),
                              position: "relative",
                            }}
                            key={recipe?.id}
                          >
                            <Image
                              source={{ uri: recipe?.foodImage }}
                              style={[
                                styles.imageStyle,
                                {
                                  height: h2dp(20),
                                },
                              ]}
                            />
                            <View style={styles.title}>
                              <Text style={styles.textStyle}>
                                {recipe?.foodName?.length > 25
                                  ? `${decode(recipe?.foodName, {
                                      level: "html5",
                                    })?.slice(0, 20)}...`
                                  : decode(recipe?.foodName, {
                                      level: "html5",
                                    })}
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
                            </View>
                          </View>
                        </TouchableOpacity>
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
