import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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
import Carousel from "react-native-snap-carousel";
import BurgerIcon from "../Components/BurgerIcon";
import PrimaryButton from "../Components/PrimaryButton";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";

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
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
      id:1,
      title: "Donate Food",
      image: require("../../assets/images/donateFood.png"),
    },
    {
      id: 3,
      title: "Volunteer at an event",
      image: require("../../assets/images/volunteerAtEvent.png"),
    },
    {
      id: 4,
      title: "Donate supplies",
      image: require("../../assets/images/donateSupplies.png"),
    },
    {
      id: 5,
      title: "See all donations & Volunteers",
      image: require("../../assets/images/seeAllDonations.png"),
      navigation:"VolunteerAndDonateScreen"
    },
  ];

  const renderItem = ({ item }: any) => {
    return (
      <View>
        <View style={[styles.card, { backgroundColor: "white" }]}>
          <TouchableOpacity>
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
                  marginLeft: w2dp(5),
                }}
              >
                {item?.title}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.description}>
            <Text style={{ alignSelf: "center", fontSize: h2dp(2.2) }}>
              You can make a Difference
            </Text>
            <PrimaryButton
              title={"Select"}
              onPress={()=>navigation.navigate(item?.navigation)}
              buttonStyle={styles.buttonStyles}
              titleStyle={styles.titleStyle}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
          style={styles.background}
        >
          <SafeAreaView>
            <View style={styles.row}>
              <Text style={styles.itemText}>Volunteer</Text>
              <View style={styles.item}>
                <BurgerIcon />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: 70,
                      backgroundColor: "white",
                      borderColor: "white",
                      height: 100,
                      borderRadius: 5,
                      zIndex: 9999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => findFoodMenuItemPress("Find Food")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Find Food
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <ScrollView>
              <Carousel
                data={cardData}
                renderItem={renderItem}
                sliderWidth={400}
                itemWidth={400}
                layout={"default"}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.7}
                firstItem={0}
                loopClonesPerSide={2}
              />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    marginLeft: 30,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginTop: h2dp(3),
  },
  card: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: h2dp(3),
    marginBottom: 10,
    height: h2dp(70),
    alignSelf: "center",
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 150,
    marginTop: h2dp(6.5),
    alignSelf: "center",
  },
  titleStyle: {
    color: "white",
    fontSize: 26,

    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  cardTextConainer: {
    marginTop: 30,
  },
  cardText: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "OpenSans-Light",
  },
  boldText: {
    fontWeight: "300",
    fontSize: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    bottom: 0,
    height: h2dp(10),
  },
  description: {
    marginTop: h2dp(3),
    display: "flex",
    justifyContent: "space-around",
  },
});

export default VolunteerDonateScreen;
