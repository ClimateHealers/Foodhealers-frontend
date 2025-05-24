import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StatusBar,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
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
  const { latitude, longitude } = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef: any = useRef(null);
  const navigation: any = useNavigation();

  const renderItem = ({ item }: any) => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="auto" barStyle="dark-content" />
      <View style={styles.slideContainer}>
        <Text style={styles.titleText}>{localized.t("VOLUNTEER")}</Text>
        <Image
          source={item.image}
          style={styles.slideImage}
          resizeMode="contain"
        />
        <Text style={styles.descriptionText}>{localized.t(item.text)}</Text>
      </View>
    </SafeAreaView>
  );

  const renderNextButton = () => (
    <Button
      title={localized.t("NEXT")}
      onPress={() => {
        if (sliderRef?.current) {
          const nextIndex = currentSlideIndex + 1;
          sliderRef.current.goToSlide(nextIndex, true);
          setCurrentSlideIndex(nextIndex);
        }
      }}
      color="#5FBB3F"
    />
  );

  const renderDoneButton = () => (
    <Button
      title={localized.t("DONE")}
      color="#5FBB3F"
      onPress={() =>
        navigation.navigate("VolunteerHomeScreen", { latitude, longitude })
      }
    />
  );

  const renderSkipButton = () => (
    <Button
      title={localized.t("SKIP")}
      onPress={() =>
        navigation.navigate("VolunteerHomeScreen", { latitude, longitude })
      }
      color="#080d07"
    />
  );

  const renderPrevButton = () => (
    <Button
      title={localized.t("PREVIOUS")}
      onPress={() => {
        if (sliderRef?.current) {
          const prevIndex = currentSlideIndex - 1;
          sliderRef.current.goToSlide(prevIndex, true);
          setCurrentSlideIndex(prevIndex);
        }
      }}
      color="#080d07"
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onDone={() =>
          navigation.navigate("VolunteerHomeScreen", { latitude, longitude })
        }
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: w2dp(5),
  },
  titleText: {
    color: "green",
    fontSize: h2dp(3),
    fontWeight: "bold",
  },
  slideImage: {
    width: w2dp(80),
    height: h2dp(35),
  },
  descriptionText: {
    fontSize: h2dp(2.5),
    color: "#00693D",
    textAlign: "center",
    marginBottom: h2dp(15),
  },
  dotStyle: {
    backgroundColor: "#CDDE85",
  },
  activeDotStyle: {
    backgroundColor: "#00693D",
  },
});

export default IntroSlider;
