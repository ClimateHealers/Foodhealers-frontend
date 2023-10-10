import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { View, Text, Button, Image, StatusBar, Platform } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { localized } from "../locales/localization";

const slides = [
  {
    key: 1,
    title: "Welcome to My App",
    text: "VOLUNTEER_AT_AN_EVENT_DONATEE_FOOD",
    image: require("../../assets/images/volunteerscollecting.png"),
  },
  {
    key: 2,
    text: "KEEP_TRACK_OF_YOUR_DONATION_HISTORY",
    image: require("../../assets/images/onlineTaxes.png"),
  },
  {
    key: 3,
    text: "EASILY_SHARE_YOUR_VOLUNTEER_SUCCESSESS_WITH_YOUR_SOCIAL_NETWORK",
    image: require("../../assets/images/shareAdvertising.png"),
  },
];

const IntroSlider = ({ route }: any) => {
  const [latitude, longitude] = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const sliderRef: any = useRef(null);

  const navigation: any = useNavigation();
  const renderItem = ({ item }: any) => (
    <>
      <SafeAreaView style={{ height: "100%" }}>
        <StatusBar backgroundColor="auto" barStyle={"dark-content"} />
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-around",
            height: "100%",
          }}
        >
          <Image source={item?.image} />
          <Text
            style={{
              fontSize: h2dp(3),
              marginHorizontal: w2dp(2),
              color: "#00693D",
              marginBottom: h2dp(15),
            }}
          >
            {localized.t(item?.text)}
          </Text>
        </View>
      </SafeAreaView>
    </>
  );

  const renderNextButton = () => (
    <View>
      <Button
        title={localized.t("NEXT")}
        onPress={() => {
          if (sliderRef?.current) {
            const nextIndex = currentSlideIndex + 1;
            sliderRef?.current?.goToSlide(nextIndex, true);
            setCurrentSlideIndex(nextIndex);
          }
        }}
        color="#5FBB3F"
      />
    </View>
  );

  const renderDoneButton = () => (
    <View>
      <Button
        title={localized.t("DONE")}
        color="#5FBB3F"
        onPress={() => {
          navigation.navigate("VolunteerHomeScreen", {
            latitude: latitude,
            longitude: longitude,
          });
        }}
      />
    </View>
  );

  const renderSkipButton = () => (
    <View>
      <Button
        title={localized.t("SKIP")}
        onPress={() =>
          navigation.navigate("VolunteerHomeScreen", {
            latitude: latitude,
            longitude: longitude,
          })
        }
        color="#080d07"
      />
    </View>
  );

  const renderPrevButton = () => (
    <View>
      <Button
        title={localized.t("PREVIOUS")}
        onPress={() => {
          if (sliderRef?.current) {
            const prevIndex = currentSlideIndex - 1;
            sliderRef?.current?.goToSlide(prevIndex, true);
            setCurrentSlideIndex(prevIndex);
          }
        }}
        color="#080d07"
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onDone={() =>
          navigation.navigate("VolunteerHomeScreen", {
            latitude: latitude,
            longitude: longitude,
          })
        }
        dotStyle={{ backgroundColor: "#CDDE85" }}
        activeDotStyle={{ backgroundColor: "#00693D" }}
        showSkipButton
        showPrevButton
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        renderPrevButton={renderPrevButton}
      />
    </View>
  );
};

export default IntroSlider;
