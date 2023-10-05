import React, { useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { localized } from "../locales/localization";


const WelcomeScreen = () => {
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" hidden = {true}  />
      <ImageBackground
        source={require("../../assets/welcomeBackground.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.logoContainer}>
           <Image
           source={require("../../assets/climateHealersLogo.png")}
           style={styles.logo}
           />
          </View>
        <View style={styles.headerContainer}>
          <Text style={styles.Headers}>{localized.t("Healthy Food should be free")}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    width: 350,
    height: 220,
    borderRadius: 10,
    marginBottom:130,
  },
  logoContainer: {
    position: "absolute",
    top: "12%",
    left: "7%",
    // width: "100%",
    width: "100%",
  },
  logo: {
    // flex: 1,
    // width: 130,
    // height: 120,
    width: 65,
    height:60,
    // resizeMode: "cover",
    // justifyContent: "center",
    // alignItems: "center",
  },
  
  Headers: {
    width: 350,
    fontSize: 55,
    color: "white",
    textAlign: "center",
    fontFamily : "Poppins-Regular"
  },
});

export default WelcomeScreen;
