import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation
} from "@react-navigation/native";
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
  View
} from "react-native";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";
import { VeganRecipesCategory } from "../redux/actions/veganRecipesCategory";

const RequestSupplyHomeScreen = ({ route }: any) => {
  const { itemTypeId, title } = route?.params;
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
                      source={require("../../assets/images/Rectangle168.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("AddRequestDonationsScreen", {
                          itemTypeId: itemTypeId,
                          title: title,
                        })
                      }
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                        {localized.t("REQUEST_NEW")}
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
                      source={require("../../assets/images/Rectangle187.png")}
                      style={styles.imageStyle}
                    />
                    <TouchableOpacity
                      onPress={() => navigation.navigate("RequestHistoryScreen",{
                        itemTypeId: itemTypeId,
                      })}
                    >
                      <View style={styles.title}>
                        <Text style={styles.textStyle}>
                          {/* {localized.t("VOLUNTEER_TO_DRIVE")} */}
                          {localized.t("SEE_ALL_REQUESTS")}
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

export default RequestSupplyHomeScreen;
