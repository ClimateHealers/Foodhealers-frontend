import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import { allEvents } from "../redux/actions/allEvents";

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
                      <Text style={styles.itemText}>{localized.t("TEAM")}</Text>
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
                      source={require("../../assets/images/shutterstock_1786476290.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                    // onPress={() =>
                    //   navigation.navigate("VolunteerDonateScreen", {
                    //     latitude: latitude,
                    //     longitude: longitude,
                    //   })
                    // }
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_VOLUNTEER")}
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
                      source={require("../../assets/images/shutterstock_633563996.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("RequestFoodHomeScreen", {
                          itemTypeId: 1,
                          title: `${localized.t("REQUEST_FOOD")}`,
                        })
                      }
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_FOOD")}
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
                      source={require("../../assets/images/Rectangle188.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                    // onPress={() => navigation.navigate("DriverProfileScreen")}
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_PICKUPS")}
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
                      source={require("../../assets/images/Rectangle189.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("RequestFoodHomeScreen", {
                          itemTypeId: 2,
                          title: `${localized.t("REQUEST_SUPPLIES")}`,
                        })
                      }
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {localized.t("REQUEST_SUPPLIES")}
                        </Text>
                      </View>
                    </TouchableOpacity>
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

export default TeamHomeScreen;
