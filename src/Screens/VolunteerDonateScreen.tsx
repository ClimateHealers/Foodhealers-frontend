import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";

const VolunteerDonateScreen = ({ route }: any) => {
  const { latitude, longitude } = route.params;
  const navigation: any = useNavigation();

  const [langOpen, setlangOpen] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const { width: screenWidth } = Dimensions.get("window");
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderRef: any = useRef(null);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const cardData = [
    {
      id: 1,
      title: `${localized.t("DONATE_FOOD")}`,
      image: require("../../assets/images/donateFood.png"),
      navigation: "SeeExistingRequestScreen",
      itemTypeId: 1,
    },
    {
      id: 2,
      title: `${localized.t("VOLUNTEER_AT_EVENT")}`,
      image: require("../../assets/images/volunteerAtEvent.png"),
      itemTypeId: 3,
      navigation: "VolunteerEventScreen",
    },
    {
      id: 3,
      title: `${localized.t("REQUEST")} ${localized.t("FOOD")}/${localized.t(
        "SUPPLIES"
      )}`,
      image: require("../../assets/images/requestFoodSupplies.png"),
      itemTypeId: 3,
      navigation: "TeamHomeScreen",
    },
    {
      id: 4,
      title: `${localized.t("DONATE_SUPPLIES")}`,
      image: require("../../assets/images/donateSupplies.png"),
      navigation: "SeeExistingRequestScreen",
      itemTypeId: 2,
    },
    {
      id: 5,
      title: `${localized.t("SEE_ALL_DONATIONS_AND_VOLUNTEERS")}`,
      image: require("../../assets/images/seeAllDonations.png"),
      navigation: "VolunteerAndDonateScreen",
    },
  ];

  const renderItem = ({ item }: any) => {
    return (
      <View>
        <TouchableOpacity activeOpacity={1}>
          <View
            style={[styles.card, { height: h2dp(70), borderRadius: h2dp(3) }]}
          >
            <View style={styles.cardText}>
              <View>
                <Image
                  source={item?.image}
                  style={{
                    width: "100%",
                    height: h2dp(45),
                    borderTopLeftRadius: h2dp(3),
                    borderTopRightRadius: h2dp(3),
                    opacity: 1,
                    position: "relative",
                  }}
                />
              </View>

              <View style={styles.headerContainer}>
                <Text
                  style={{
                    color: "white",
                    fontSize: h2dp(3),
                    textAlign: "center",
                  }}
                >
                  {item?.title}
                </Text>
              </View>
            </View>
            <View style={styles.description}>
              <Text style={{ alignSelf: "center", fontSize: h2dp(2.2) }}>
                {localized.t("YOU_CAN_MAKE_A_DIFFERENCE")}
              </Text>
              <PrimaryButton
                title={localized.t("SELECT")}
                onPress={() => {
                  handlePressOutside(),
                  navigation.navigate(item?.navigation, {
                    itemTypeId: item?.itemTypeId,
                    title: item?.title,
                    latitude: latitude,
                    longitude: longitude,
                  })
                }}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <FoodhealersHeader />
              <View style={styles.root}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => {navigation.goBack(),handlePressOutside()}}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("VOLUNTEER")}
                  </Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View style={{ marginHorizontal: "-4%" }}>
                <Carousel
                  ref={sliderRef}
                  data={cardData}
                  renderItem={renderItem}
                  sliderWidth={screenWidth}
                  sliderHeight={screenWidth}
                  itemWidth={screenWidth}
                  layout={"default"}
                  inactiveSlideScale={0.8}
                  inactiveSlideOpacity={0.8}
                  firstItem={0}
                  loopClonesPerSide={2}
                  onSnapToItem={(index) => setActiveSlide(index)}
                  pagingEnabled={true}
                />
                <Pagination
                  dotsLength={cardData?.length}
                  activeDotIndex={activeSlide}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#CDDE85",
                  }}
                  inactiveDotStyle={{
                    backgroundColor: "#CDDE85",
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerDonateScreen;
