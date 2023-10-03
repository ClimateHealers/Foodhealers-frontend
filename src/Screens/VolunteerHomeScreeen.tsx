import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
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
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { VeganRecipesCategories } from "../redux/actions/veganRecipes";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";
import { localized } from "../locales/localization";

const VolunteerHomeScreen = () => {
  const [langOpen, setlangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recipeData, setRecipeData] = useState<[]>([]);

  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const allEvents = useSelector(
    (state: any) => state?.allEvents?.data?.foodEvents
  );
  // const eve = allEvents?.map((event: any) => event);
  console.log("allEvents", allEvents);

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategory(1 as any) as any);
    setRecipeData(response?.payload?.results?.recipeList);
  };

  useEffect(() => {
    fetchRecipesCategories();
  }, [recipeData]);

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
          <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled">
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.containerVolunteer}>
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
                      <Text style={styles.itemText}>{localized.t("Home")}</Text>
                    </View>
                    <BurgerIcon />
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp(3),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shutterShock.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("VolunteerDonateScreen")
                      }
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("Volunteer/Donate")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp(3),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/volunteerToDrive.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                    // onPress={() => navigation.navigate("CategoryScreen")}
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("Volunteer to Drive")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {allEvents && allEvents?.length && (
                    <View>
                      <Text style={[styles.subHeading]}>
                        {localized.t("Events")}
                      </Text>
                    </View>
                  )}
                  <ScrollView
                    horizontal={true}
                    keyboardShouldPersistTaps="always"
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: h2dp(3) }}
                  >
                    <View style={styles.horizonatalView}>
                      {allEvents?.map((event: any) => (
                        <View
                          key={event?.id}
                          style={{
                            // marginLeft: w2dp(1),
                            position: "relative",
                          }}
                        >
                          <Image
                            source={{ uri: event?.eventPhoto }}
                            style={styles.imageStyle}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              // getLocation().then((location: any) => {
                              //   if (location) {
                              navigation?.navigate(
                                "VolunteerSingleEventDetails",
                                {
                                  eventDetails: {
                                    id: event?.id,
                                    map: true,
                                    name: event?.name,
                                    address: event?.address?.fullAddress,
                                    eventStartDate: event?.eventStartDate,
                                    eventEndDate: event?.eventEndDate,
                                    lat: event?.address?.lat,
                                    long: event?.address?.lng,
                                    eventPhoto: event?.eventPhoto,
                                    requiredVolunteers:
                                      event?.requiredVolunteers,
                                    additionalInfo: event?.additionalInfo,
                                  },
                                  //     }
                                  //   );
                                  // }
                                }
                              )
                            }
                          >
                            <View style={styles.title}>
                              <Text style={styles.textStyle}>
                                {event?.address?.city}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                  {recipeData && (
                    <View>
                      <Text style={styles.subHeading}>
                        {localized.t("Vegan Recipes")}
                      </Text>
                    </View>
                  )}

                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // style={{ marginBottom: h2dp(3) }}
                  >
                    <View style={styles.horizonatalView}>
                      {recipeData &&
                        recipeData?.map((recipe: any) => (
                          <View
                            key={recipe?.id}
                            style={{
                              marginLeft: w2dp(7),
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: recipe?.foodImage }}
                              style={styles.imageStyle}
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
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                    </View>
                  </ScrollView>
                  <TouchableOpacity>
                    <Image
                      source={require("../../assets/images/map.png")}
                      style={styles.mapImage}
                    />
                  </TouchableOpacity>
                  <View style={{ marginVertical: h2dp(4) }}>
                    <Text style={styles.mapContent}>15346</Text>
                    <Text style={styles.mapContent}>
                      {localized.t("Events Scheduled")}
                    </Text>
                  </View>
                </View>
                {/* </View> */}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

export default VolunteerHomeScreen;
