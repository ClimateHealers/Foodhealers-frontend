import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BurgerIcon from "../Components/BurgerIcon";
import PrimaryButton from "../Components/PrimaryButton";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { Ionicons } from "@expo/vector-icons";

const VolunteerDonateScreen = ({ route }: any) => {
  const navigation: any = useNavigation();

  const [langOpen, setlangOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "French", value: "fr" },
    { id: 2, label: "Hindi", value: "hi" },
    { id: 3, label: "Bengali", value: "be" },
    { id: 4, label: "Chinese", value: "ch" },
    { id: 5, label: "Mandarin", value: "ma" },
    { id: 6, label: "Punjabi", value: "pu" },
    { id: 7, label: "English", value: "en" },
    { id: 8, label: "Spanish", value: "es" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { width: screenWidth } = Dimensions.get("window");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const sliderRef: any = useRef(null);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };
  const cardData = [
    {
      id: 1,
      title: `${localized.t("Donate Food")}`,
      image: require("../../assets/images/donateFood.png"),
      navigation: "AddDonationsScreen",
      itemTypeId: 1,
    },
    {
      id: 2,
      title: `${localized.t("Volunteer at an event")}`,
      image: require("../../assets/images/volunteerAtEvent.png"),
      itemTypeId: 3,
      navigation: "VolunteerEventScreen",
    },
    {
      id: 3,
      title: `${localized.t("Donate supplies")}`,
      image: require("../../assets/images/donateSupplies.png"),
      navigation: "AddDonationsScreen",
      itemTypeId: 2,
    },
    {
      id: 4,
      title: `${localized.t("See all donations & Volunteers")}`,
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
                    // marginLeft: w2dp(5),
                    textAlign: "center",
                  }}
                >
                  {item?.title}
                </Text>
              </View>
            </View>
            <View style={styles.description}>
              <Text style={{ alignSelf: "center", fontSize: h2dp(2.2) }}>
                {localized.t("You can make a Difference")}
              </Text>
              <PrimaryButton
                title={localized.t("Select")}
                onPress={() =>
                  navigation.navigate(item?.navigation, {
                    itemTypeId: item?.itemTypeId,
                    title: `${localized.t(item?.title)}`,
                  })
                }
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
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("Volunteer")}
                  </Text>
                </View>
                <BurgerIcon />
              </View>
              <View style={{marginHorizontal: "-4%"}}>
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
