import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
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
import { localized } from "../locales/localization";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";

const VolunteerHomeScreen = ({ route }: any) => {
  const { latitude, longitude } = route.params;
  const [recipeData, setRecipeData] = useState<[]>([]);
  const [events, setEvents] = useState<[]>([]);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const fetchingEventsData = async () => {
    const response = await dispatch(allEvents({} as any) as any);
    const data = response?.payload?.foodEvents;
    setEvents(data);
  };
  const allEvents = useSelector(
    (state: any) => state?.allEvents?.data?.foodEvents
  );
  const eventsScheduled = allEvents?.length;

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategory(1 as any) as any);
    setRecipeData(response?.payload?.results?.recipeList);
  };

  useEffect(() => {
    fetchRecipesCategories();
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss();
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
                      <Text style={styles.itemText}>{localized.t("HOME")}</Text>
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
                          {localized.t("VOLUNTEER/DONATE")}
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
                    <TouchableOpacity>
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("VOLUNTEER_TO_DRIVE")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {allEvents && allEvents?.length && (
                    <View>
                      <Text style={[styles.subHeading]}>
                        {localized.t("EVENTS")}
                      </Text>
                    </View>
                  )}
                  <ScrollView
                    horizontal={true}
                    keyboardShouldPersistTaps="always"
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: h2dp(3) }}
                  >
                    <TouchableOpacity activeOpacity={1}>
                      <View style={styles.horizonatalView}>
                        {allEvents?.slice(0, 1)?.map((event: any) => (
                          <View
                            key={event?.id}
                            style={{
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: event?.eventPhoto }}
                              style={styles.imageStyle}
                            />
                            <TouchableOpacity
                              onPress={() =>
                                navigation?.navigate("WeekScreen", {
                                  currentlatitude: latitude,
                                  currentlongitude: longitude,
                                  city: event?.address?.city,
                                  state: event?.address?.state,
                                  fullAddress: event?.address?.fullAddress,
                                  postalCode: event?.address?.postalCode,
                                  lat: event?.address?.lat,
                                  lng: event?.address?.lng,
                                  address: event?.address,
                                })
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
                    </TouchableOpacity>
                  </ScrollView>
                  {recipeData && (
                    <View>
                      <Text style={styles.subHeading}>
                        {localized.t("VEGAN_RECIPES")}
                      </Text>
                    </View>
                  )}
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableOpacity activeOpacity={1}>
                      <View style={styles.horizonatalView}>
                        {recipeData &&
                          recipeData?.slice(1, 2)?.map((recipe: any) => (
                            <View
                              key={recipe?.id}
                              style={{
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
                                    navigation.navigate("RecipesHomeScreen", {
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
                    </TouchableOpacity>
                  </ScrollView>
                  <TouchableOpacity>
                    <View style={{ marginTop: h2dp(4) }}>
                      <Image
                        source={require("../../assets/images/map.png")}
                        style={styles.mapImage}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={{ marginVertical: h2dp(3) }}>
                    <Text style={styles.mapContent}>{eventsScheduled}</Text>
                    <Text style={styles.mapContent}>
                      {localized.t("EVENTS_SCHEDULED")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

export default VolunteerHomeScreen;
