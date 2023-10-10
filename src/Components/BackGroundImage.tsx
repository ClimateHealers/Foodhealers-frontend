import React from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const BackgroundImg = () => {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/homeImage2.jpg")}
        style={styles.img}
      ></ImageBackground>
    </View>
  );
};

export default BackgroundImg;

const styles = StyleSheet.create({
  img: {
    height: screenHeight,
    flex: 1,
    width: "110%",
    justifyContent: "center",
    alignItems: "center",
  },
});
