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
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import BurgerIcon from "../Components/BurgerIcon";
import { localized } from "../locales/localization";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";

const RecipesHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recipesCategory, setRecipeData] = useState([]);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategory(1 as any) as any);
    setRecipeData(response?.payload?.results?.recipeList);
  };

  useEffect(() => {
    fetchRecipesCategories();
  }, []);

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
              <BurgerIcon />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={[styles.centeredView]}>
                  {recipesCategory?.map((receipeName: any) => {
                    const recipe = receipeName?.category[0];
                    return (
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
                        />
                        <View style={styles.title}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("CategoryScreen", {
                                categoryId: recipe?.id,
                                recipeName: recipe?.name,
                              })
                            }
                          >
                            <Text style={styles.textStyle}>{recipe?.name}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
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
