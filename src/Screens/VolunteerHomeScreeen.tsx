import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
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
import { localized } from "../locales/localization";
import { fetchUser } from "../redux/actions/authAction";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";
import { SafeAreaView } from "react-native-safe-area-context";
import { nearbyEvents } from "../redux/actions/nearbyEvents";

const VolunteerHomeScreen = ({ route }: any) => {
  const { latitude, longitude } = route.params;
  const [recipeData, setRecipeData] = useState<[]>([]);
  const navigation: any = useNavigation();
  const [menuClose, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState<any>();

  const menuRef = useRef(null);

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategory(1 as any) as any);
    setRecipeData(response?.payload?.results?.recipeList);
  };

  const { events: nearbyEventsList } = useSelector(
    (state: any) => state.nearbyEvents
  );
  const activeEvents = nearbyEventsList?.filter((event: any) => event?.active);
  const eventsScheduled = activeEvents?.length > 0 ? activeEvents.length : 0;

  useEffect(() => {
    if (activeEvents.length === 0) {
      dispatch(nearbyEvents({ radius: 50 } as any) as any);
    }
  }, [dispatch]);

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipesCategories();
      fetchingUserData();
    }, [])
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <LinearGradient
          colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
          style={styles.background}
        >
          <SafeAreaView style={styles.containerVolunteer}>
            <FoodhealersHeader />
            <View style={styles.root}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => navigation.replace("HomeScreen")}
              />
              <View style={styles.item}>
                <Text style={styles.itemText}>{localized.t("HOME")}</Text>
              </View>
              <BurgerIcon
                style={{ zIndex: 10 }}
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity activeOpacity={1}>
                <TouchableOpacity
                  onPress={() => {
                    handlePressOutside(),
                      navigation.navigate("VolunteerDonateScreen", {
                        latitude: latitude,
                        longitude: longitude,
                      });
                  }}
                >
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
                    <View style={styles.title}>
                      <Text style={styles.textStyle}>
                        {localized.t("VOLUNTEER/DONATE")}/
                        {localized.t("REQUEST")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handlePressOutside(),
                      data?.isDriver
                        ? navigation.navigate("DriverRequestScreen")
                        : navigation.navigate("BecomeADriverScreen");
                  }}
                >
                  <View
                    style={{
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/volunteerToDrive.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <Text style={styles.textStyle}>
                        {localized.t("VOLUNTEER_TO_DRIVE")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {activeEvents?.length > 0 && (
                  <View
                    style={{
                      alignSelf: "flex-start",
                      marginTop: h2dp(2),
                    }}
                  >
                    <Text style={[styles.subHeading]}>
                      {localized.t("EVENTS")}
                    </Text>
                  </View>
                )}
                <ScrollView
                  horizontal={true}
                  keyboardShouldPersistTaps="always"
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: h2dp(2) }}
                >
                  <TouchableOpacity activeOpacity={1}>
                    <View style={styles.horizonatalView}>
                      {activeEvents?.slice(0, 1)?.map((event: any) => (
                        <TouchableOpacity
                          onPress={() => {
                            handlePressOutside(),
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
                              });
                          }}
                        >
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
                            <View style={styles.title}>
                              <Text style={styles.textStyle}>
                                {event?.address?.city}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                </ScrollView>
                {recipeData && (
                  <View
                    style={{
                      alignSelf: "flex-start",
                    }}
                  >
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
                          <TouchableOpacity
                            onPress={() => {
                              handlePressOutside(),
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
                                });
                            }}
                          >
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
                                <Text style={styles.textStyle}>
                                  {recipe?.foodName?.length > 25
                                    ? `${recipe?.foodName?.slice(0, 25)}...`
                                    : recipe?.foodName}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </TouchableOpacity>
                </ScrollView>
                <View style={{ marginTop: h2dp(4) }}>
                  <Image
                    source={require("../../assets/images/map.png")}
                    style={styles.mapImage}
                  />
                </View>
                <View style={{ marginVertical: h2dp(4) }}>
                  <Text style={styles.mapContent}>{eventsScheduled}</Text>
                  <Text style={styles.mapContent}>
                    {localized.t("EVENTS_SCHEDULED")}
                  </Text>
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
