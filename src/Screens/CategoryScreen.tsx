import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { decode } from "html-entities";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/GetCurrentLocation";
import API from "../Utils/APIUtils";
import { localized } from "../locales/localization";
import {
  VeganAllRecipes,
  VeganRecipesCategory,
} from "../redux/actions/veganRecipesCategory";
import { useDebounce } from "../Components/Debounce";

const blurhash = "LBE~3[-;j[oy_MoMfQj[offQfQfQ";

const CategoryScreen = ({ route }: any) => {
  const { categoryId, recipeName } = route.params;
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const [langOpen, setlangOpen] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [recipeCat, setRecipeCat] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [textChange, setTextChange] = useState(false);
  const [page, setPage] = useState(2);
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

  const searchData = {
    searchText: searchText?.toLowerCase(),
    category: categoryId,
  };

  const searchQuery = useDebounce(searchData, 200);

  const searchCharacter = async () => {
    if (searchText === "") {
      setTextChange(false);
    } else {
      setTextChange(true);
      const data: any = await dispatch(VeganAllRecipes(searchQuery));
      setFilteredData(data?.payload?.results?.recipeList);
    }
  };

  useEffect(() => {
    fetchRecipesCategory();
    fetchData();
  }, []);

  useEffect(() => {
    searchCharacter();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setResponse({
        loading: true,
        message: "",
        error: false,
      });

      API.get(`v1/api/recipe/${categoryId}/?page=${page}`)
        .then((response) => {
          if (response?.data?.results?.recipeList?.length > 0) {
            setData((prevData: any[]) => [
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

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const handleSearchTextChange = async (text: any) => {
    setSearchText(text);
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
                onPress={() => {
                  navigation.goBack(), handlePressOutside();
                }}
              />
              <View style={styles.dropdownContainer}></View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.item, { alignItems: "center" }]}>
                  <Text style={styles.itemText}>{recipeName}</Text>
                </View>
              </ScrollView>
              <BurgerIcon
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
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
              scrollEventThrottle={100}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={[styles.centeredalignView]}>
                  {textChange
                    ? filteredData?.map((recipe: any) => (
                        <TouchableOpacity
                          onPress={() => {
                            handlePressOutside(),
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
                              });
                          }}
                        >
                          <View
                            key={recipe?.id}
                            style={{
                              marginBottom: h2dp(2),
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
                    : data?.map((recipe: any) => (
                        <TouchableOpacity
                          onPress={() => {
                            handlePressOutside(),
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
                              });
                          }}
                        >
                          <View
                            style={{
                              marginBottom: h2dp(2),
                              position: "relative",
                            }}
                            key={recipe?.id}
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
                  {filteredData?.length > 0 && data?.length > 0 ? (
                    <Text
                      style={{
                        color: "white",
                        fontSize: h2dp(1.5),
                        marginBottom: h2dp(1.5),
                      }}
                    >
                      Loading...
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: h2dp(1.5),
                        marginBottom: h2dp(1.5),
                      }}
                    >
                      No results found
                    </Text>
                  )}
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
