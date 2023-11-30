import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
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
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const RecipesHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recipesCategory, setRecipeData] = useState([]);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategories() as any);
    setRecipeData(response?.payload?.categoriesList);
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
                <View style={[styles.centeredalignView]}>
                  {recipesCategory.map((recipe: any) => (
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
                          <Text style={styles.textStyle}>{recipe?.name}</Text>
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
