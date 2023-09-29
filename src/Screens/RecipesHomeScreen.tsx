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
          <SafeAreaView style={styles.container}>
            <FoodhealersHeader />
            <View style={styles.root}>
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

// const styles = StyleSheet.create({
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     flex: 1,
//     height: h2dp("100%"),
//     // marginBottom: h2dp(15),
//   },
//   background: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     width: "100%",
//     zIndex: 9999,
//   },
//   item: {
//     width: "30%",
//     marginTop: 25,
//     height: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },
//   dropdownContainer: {
//     marginTop: 15,
//     marginLeft: 15,
//     width: "30%",
//     height: 100,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   itemText: {
//     fontSize: 25,
//     color: "white",
//   },
//   imageStyle: {
//     borderRadius: 10,
//     width: w2dp(85),
//     height:h2dp(20)
//   },
//   title: {
//     backgroundColor: "white",
//     opacity: 0.9,
//     width: w2dp(85),
//     // height: "20%",
//     position: "absolute",
//     bottom: 0,
//     borderBottomRightRadius: 10,
//     borderBottomLeftRadius: 10,
//   },
//   textStyle: {
//     textAlign: "center",
//     fontSize: 26,
//     lineHeight: 35,
//     fontWeight: "normal",
//     fontStyle: "normal",
//     marginTop: 13,
//   },
//   centeredView: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: h2dp(2),
//   },
// });

export default RecipesHomeScreen;
