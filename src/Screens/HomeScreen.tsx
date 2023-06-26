import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../Components/PrimaryButton";
import { myTheme } from "../myTheme";
import { localized } from "../locales/localization";
import { useSelector } from "react-redux";

const HomeScreen = ({ route }: any) => {
  const userDetails = useSelector((state: any) => state.auth);

  const { data } = userDetails;

  const [loc, setLoc] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [lang, setLang] = useState([
    { id: 1, label: "Bengali", value: "be" },
    { id: 2, label: "Chinese", value: "ch" },
    { id: 3, label: "English", value: "en" },
    { id: 4, label: "French", value: "fr" },
    { id: 5, label: "Hindi", value: "hi" },
    { id: 6, label: "Mandarin", value: "ma" },
    { id: 7, label: "Punjabi", value: "pu" },
    { id: 8, label: "Spanish", value: "es" },
  ]);

  const handlePressOutside = () => {
    setlangOpen(false);
  };
  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  //  const getLocation = async () => {
  //     try {
  //       setLoc(true);
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.log("permission to access location was denied");
  //         setLoc(false);
  //         Alert.alert(
  //           "Location permission denied",
  //           "Please grant permission to access your location to use this feature.",
  //           [{ text: "OK" }],
  //           { cancelable: false }
  //         );
  //         return;
  //       }
  //       let askLocationPermission = await Location.getCurrentPositionAsync({});
  //      if(askLocationPermission){
  //       let location =  await Location.watchPositionAsync(
  //         { distanceInterval: 5 }, // Minimum distance (in meters) for updates
  //         (newLocation) => {
  //           // setLocation(newLocation.coords);
  //           // console.log("checking live location", newLocation.coords)
  //           if (location) {
  //             setLoc(false);
  //             navigation.navigate("MapScreen", {
  //               location: newLocation,
  //             });
  //           } else {
  //             setLoc(false);
  //           }
  //         }
  //       );
  //      }

  //       // if (location) {
  //       //   setLoc(false);
  //       //   navigation.navigate("MapScreen", {
  //       //     location: location,
  //       //   });
  //       // } else {
  //       //   setLoc(false);
  //       // }
  //     } catch (error) {
  //       setLoc(true);
  //       console.error(error);
  //     }
  //   };
  const getLocation = async () => {
    try {
      setLoc(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("permission to access location was denied");
        setLoc(false);
        Alert.alert(
          "Location permission denied",
          "Please grant permission to access your location to use this feature.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        return;
      }
      let location = await Location.getLastKnownPositionAsync({});
      if (location) {
        setLoc(false);
        navigation.navigate("MapScreen", {
          location: location,
        });
      } else {
        setLoc(false);
      }
    } catch (error) {
      setLoc(true);
      console.error(error);
    }
  };

  const appLoader = (loader: any) => {
    return (
      <View style={styles.centeredView}>
        <Modal visible={loader} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={"large"} color="white" />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const navigation: any = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <StatusBar backgroundColor="auto" barStyle="dark-content" />
        <ImageBackground
          source={require("../../assets/homeScreen.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.dropdownContainer}>
            <SelectDropdown
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={() => {
                return (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={18}
                    color="#B50000"
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              data={lang && lang.map((dd) => dd.label)}
              onSelect={changeLanguage}
              defaultButtonText={"EN"}
              buttonTextAfterSelection={(itemValue, index) => {
                return lang[index].value.toUpperCase();
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
          <View style={{ flex: 1 }}>{appLoader(loc == true)}</View>
          <View style={styles.headerContainer}>
            <PrimaryButton
              title={localized.t("Find Food")}
              onPress={getLocation}
              buttonStyle={myTheme.Button.buttonStyle}
              titleStyle={styles.titleStyle}
            />
            <PrimaryButton
              title={localized.t("Post Event")}
              buttonStyle={styles.postEventButton}
              onPress={() => {
                navigation.navigate("EventsHomeScreen");
              }}
              titleStyle={styles.titleStyle}
            />
            {data?.user?.name ? (
              ""
            ) : (
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  marginBottom: 5,
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {localized.t("Already have an account?")}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              {data?.user?.name ? (
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontFamily: "OpenSans-Bold",
                  }}
                >
                  {localized.t("Welcome")}{" "}
                  {data?.user?.name ? data?.user?.name : ""}
                </Text>
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textDecorationLine: "underline",
                    fontFamily: "OpenSans-Bold",
                  }}
                >
                  {localized.t("Sign in")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    width: "100%",
    height: 260,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  Headers: {
    width: 350,
    fontSize: 40,
    color: "white",
    textAlign: "center",
  },
  findFoodButton: {
    backgroundColor: "#5FBB3F",
    color: "black",
    borderRadius: 5,
    width: 190,
    marginBottom: 20,
    marginTop: 40,
  },
  postEventButton: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 5,
    marginBottom: 25,
    minWidth: 190,
    maxHeight: 50,
  },
  content: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    zIndex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "70%",
  },
  titleStyle: {
    color: "black",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdown1BtnStyle: {
    marginTop: 15,
    width: "30%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdown1BtnTxtStyle: { color: "#B50000", textAlign: "left", fontSize: 14 },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    color: "black",
    borderRadius: 4,
    height: 180,
    fontSize: 14,
    borderColor: "blue",
  },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    color: "#B50000",
    borderBottomColor: "#D1D1D6",
    borderRadius: 5,
  },
  dropdown1RowTxtStyle: { color: "black", textAlign: "center", fontSize: 10 },
});

export default HomeScreen;
