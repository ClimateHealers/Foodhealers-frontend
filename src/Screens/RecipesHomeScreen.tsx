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
import { useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import BurgerIcon from "../Components/BurgerIcon";

const RecipesHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation: any = useNavigation();

  const recipesCategory = useSelector(
    (state: any) => state?.recipesCategory?.data?.categoriesList
  );

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
                {/* <Text style={styles.itemText}>{localized.t("Find Food")}</Text> */}
                <Text style={styles.itemText}>Recipes</Text>
              </View>
              <BurgerIcon />
            </View>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={[styles.centeredView]}>
                {recipesCategory.map((recipe: any) => (
                  <View
                    key={recipe.id}
                    style={{
                      marginBottom: h2dp(3),
                      position: "relative",
                    }}
                  >
                    <Image
                      // source={require("../../assets/images/lunchPicture.png")}
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
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

export default RecipesHomeScreen;
