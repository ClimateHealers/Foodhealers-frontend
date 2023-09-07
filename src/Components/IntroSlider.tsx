import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { View, Text, Button, Image, StatusBar, Platform } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";

const slides = [
  {
    key: "slide1",
    title: "Welcome to My App",
    text: "Volunteer at an event, donate food, or become a driver.",
    image: require("../../assets/images/volunteerscollecting.png"),
  },
  {
    key: "slide2",
    text: "Keep track of your donation history.",
    image: require("../../assets/images/onlineTaxes.png"),
  },
  {
    key: "slide3",
    text: "Easily share your volunteer successes with your social network.",
    image: require("../../assets/images/shareAdvertising.png"),
  },
];

const IntroSlider = () => {
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
          <Image source={item.image} />
          <Text
            style={{
              fontSize: h2dp(3),
              marginHorizontal: w2dp(2),
              color: "#00693D",
              marginBottom: h2dp(15),
            }}
          >
            {item.text}
          </Text>
        </View>
      </SafeAreaView>
    </>
  );

  const renderNextButton = () => (
    <View>
      <Button
        title="Next"
        onPress={() => {
          if (sliderRef.current) {
            const nextIndex = currentSlideIndex + 1;
            sliderRef.current.goToSlide(nextIndex, true);
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
        title="Done"
        color="#5FBB3F"
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
      />
    </View>
  );

  const renderSkipButton = () => (
    <View>
      <Button
        title="Skip"
        onPress={() => navigation.navigate("LoginScreen")}
        color="#080d07"
      />
    </View>
  );

  const renderPrevButton = () => (
    <View>
      <Button
        title="Previous"
        onPress={() => {
          if (sliderRef.current) {
            const prevIndex = currentSlideIndex - 1;
            sliderRef.current.goToSlide(prevIndex, true);
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
        onDone={() => navigation.navigate("LoginScreen")}
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
