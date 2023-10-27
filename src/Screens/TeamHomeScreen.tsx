import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
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
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";

const TeamHomeScreen = ({ route }: any) => {
  const [recipeData, setRecipeData] = useState<[]>([]);
  const [events, setEvents] = useState<[]>([]);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const eventsScheduled = events?.length;

  const fetchRecipesCategories = async () => {
    const response = await dispatch(VeganRecipesCategory(1 as any) as any);
    setRecipeData(response?.payload?.results?.recipeList);
  };

  const fetchingEventsData = async () => {
    const response = await dispatch(allEvents({} as any) as any);
    const data = response?.payload?.foodEvents;
    setEvents(data);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipesCategories();
      fetchingEventsData();
    }, [])
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <LinearGradient
          colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
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
                      <Text style={styles.itemText}>{localized.t("TEAM")}</Text>
                    </View>
                    <BurgerIcon />
                  </View>
                  {/* <View
                    style={{
                      marginBottom: h2dp(3),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shutterstock_1786476290.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                      // onPress={() =>
                      //   navigation.navigate("VolunteerDonateScreen", {
                      //     latitude: latitude,
                      //     longitude: longitude,
                      //   })
                      // }
                      >
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_VOLUNTEER")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("RequestFoodHomeScreen", {
                        itemTypeId: 1,
                        title: `${localized.t("REQUEST_FOOD")}`,
                      })
                    }
                  >
                    <View
                      style={{
                        marginTop: h2dp(3),
                        marginBottom: h2dp(3),
                        position: "relative",
                      }}
                    >
                      <Image
                        source={require("../../assets/images/shutterstock_633563996.png")}
                        style={styles.imageStyle}
                      />
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_FOOD")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* <View
                    style={{
                      marginBottom: h2dp(3),
                      position: "relative",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/Rectangle188.png")}
                      style={styles.imageStyle}
                    />
                    <View style={styles.title}>
                      <TouchableOpacity
                      // onPress={() => navigation.navigate("DriverProfileScreen")}
                      >
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_PICKUPS")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("RequestFoodHomeScreen", {
                        itemTypeId: 2,
                        title: `${localized.t("REQUEST_SUPPLIES")}`,
                      })
                    }
                  >
                    <View
                      style={{
                        marginBottom: h2dp(3),
                        position: "relative",
                      }}
                    >
                      <Image
                        source={require("../../assets/images/Rectangle189.png")}
                        style={styles.imageStyle}
                      />
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_SUPPLIES")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
};

export default TeamHomeScreen;
