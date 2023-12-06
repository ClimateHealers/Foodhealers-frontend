import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
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
import { VeganRecipesCategories } from "../redux/actions/veganRecipes";
import { Image } from "expo-image";
import { VeganAllRecipes } from "../redux/actions/veganRecipesCategory";
import { decode } from "html-entities";
import API from "../Utils/APIUtils";

const blurhash = "LBE~3[-;j[oy_MoMfQj[offQfQfQ";

const RecipesHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [recipesCategory, setRecipeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [textChange, setTextChange] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategories() as any);
    setRecipeData(response?.payload?.categoriesList);
  };

  useEffect(() => {
    fetchRecipesCategories();
  }, []);

  const token = useSelector((state: any) => state.auth.data.token);

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setResponse({
        loading: true,
        message: "",
        error: false,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        params: {
          search_keyword: searchText?.toLowerCase(),
        },
      };

      API.get(`v1/api/search-recipe/?page=${page}`, config)
        .then((response) => {
          if (response?.data?.results?.recipeList?.length > 0) {
            setFilteredData((prevData: any[]) => [
              ...prevData,
              ...response.data?.results?.recipeList,
            ]);
            setPage(page + 1);
            setLoading(false);
          } else {
            setHasMoreData(false);
          }
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

  const handleSearchTextChange = async (text: any) => {
    setSearchText(text);
    setTextChange(true);
    if (text === "") {
      setTextChange(false);
    } else {
      const response = await dispatch(
        VeganAllRecipes(text?.toLowerCase() as any) as any
      );
      setFilteredData(response?.payload?.results?.recipeList);
    }
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
              <View style={styles.item}>
                <Text style={styles.itemText}>{localized.t("RECIPES")}</Text>
              </View>
              <BurgerIcon
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
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
              scrollEventThrottle={100}
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
                              placeholder={blurhash}
                              contentFit="cover"
                              transition={1000}
                              source={{ uri: recipe?.foodImage }}
                              style={[
                                styles.imageStyle,
                                {
                                  height: h2dp(20),
                                },
                              ]}
                            />
                            <View style={styles.title}>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    textTransform: "capitalize",
                                  },
                                ]}
                              >
                                {recipe?.foodName?.length > 25
                                  ? `${decode(
                                      (recipe?.foodName).toLowerCase(),
                                      {
                                        level: "html5",
                                      }
                                    )?.slice(0, 20)}...`
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
                    : recipesCategory.map((recipe: any) => (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("CategoryScreen", {
                              categoryId: recipe?.id,
                              recipeName: recipe?.name,
                            })
                          }
                        >
                          <View
                            key={recipe.id}
                            style={{
                              marginBottom: h2dp(3),
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: recipe?.categoryImage }}
                              style={styles.imageStyle}
                              placeholder={blurhash}
                              contentFit="cover"
                              transition={1000}
                            />
                            <View style={styles.title}>
                              <Text style={styles.textStyle}>
                                {recipe?.name}
                              </Text>
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

export default RecipesHomeScreen;
