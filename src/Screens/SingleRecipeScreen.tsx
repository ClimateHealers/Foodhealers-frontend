import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";

const SingleRecipeScreen = ({ route }: any) => {
  const { recipeData } = route.params;

  const ingredients = recipeData?.recipeIngredient
    .replace(/\[|\]|'/g, "")
    .split(",");
  const instructions = recipeData?.recipeInstructions.replace(/\[|\]|'/g, "");

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={[
                  styles.item,
                  { alignSelf: "center", justifyContent: "center" },
                ]}
              >
                <Text style={styles.itemText}>{recipeData?.recipeName?.length > 25 ? `${recipeData?.recipeName?.slice(0,25)}...` : recipeData?.recipeName}</Text>
              </View>
            </ScrollView>
            <BurgerIcon />
          </View>
          <ScrollView keyboardShouldPersistTaps="always">
            <View>
              <TouchableOpacity activeOpacity={1}>
                <Image
                  source={{ uri: recipeData?.recipeImage }}
                  style={{
                    alignSelf: "center",
                    width: w2dp(90),
                    height: h2dp(30),
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1}>
                <View
                  style={{
                    marginVertical: h2dp(2),
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",}}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: h2dp(3),
                      }}
                    >
                      {localized.t("COOKING_TIME")}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: w2dp(2),
                      marginTop: h2dp(1),
                    }}
                  >
                    <Ionicons name="ios-time-outline" size={20} color="white" />
                    <Text
                      style={{
                        marginLeft: 4,
                        color: "white",
                      }}
                    >
                      {recipeData?.cookingTime ===
                      "preparation time not specified"
                        ? `${localized.t("NOT_SPECIFIED")}`
                        : recipeData?.cookingTime}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginBottom: h2dp(2),
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(3),
                      marginBottom: h2dp(2),
                    }}
                  >
                    {localized.t("INGREDIIENTS")}
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
                      marginBottom: h2dp(2),
                    }}
                  >
                    {localized.t("INSTRUCTIONS")}
                  </Text>
                  <Text style={styles.ingredient}>{instructions}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(2),
                      margin: h2dp(2),
                    }}
                  >
                    {localized.t("SOURCE")} :{" "}
                    <Text
                      style={styles.underlineTextStyle}
                      onPress={() => Linking.openURL(recipeData?.recipeSource)}
                    >
                      {recipeData?.recipeSource}
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(2),
                      marginBottom: h2dp(2),
                      marginLeft: h2dp(2),
                    }}
                  >
                    {localized.t("CREDITS")} : {recipeData?.recipeCredits}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SingleRecipeScreen;
