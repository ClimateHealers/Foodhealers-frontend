import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import BackgroundImg from "../Components/BackGroundImage";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";
import { myTheme } from "../myTheme";
import { setLanguage } from "../redux/reducers/langReducer";
import { myDonations } from "../redux/actions/myDonations";
import { volunteerHistory } from "../redux/actions/volunteerHistoryAction";
import { Dimensions } from "react-native";

const HomeScreen = ({ route }: any) => {
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const languageName = useSelector((state: any) => state.language);

  const dispatch = useDispatch();

  const [loc, setLoc] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [donationData, setDonationData] = useState("");
  const [volunteerData, setVolunteerData] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
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

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  console.log("windowHeightwindowHeightwindowHeight", windowHeight);
  const handlePressOutside = () => {
    setlangOpen(false);
  };
  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await axios.get("http://ipinfo.io/json");
        const { loc } = response.data;
        const [latitude, longitude] = loc
          .split(",")
          .map((coord: any) => parseFloat(coord));
        setLat(latitude);
        setLong(longitude);
        return { latitude, longitude };
      } catch (error) {
        console.error("Error fetching user location", error);
        return null;
      }
    };
    getUserLocation();
    fetchingDonationData();
    fetchingvolunteerHistory();
  }, []);

  const fetchingDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    setDonationData(response?.payload?.donationList);
  };

  const fetchingvolunteerHistory = async () => {
    const response = await dispatch(volunteerHistory({} as any) as any);
    setVolunteerData(response?.payload?.volunteerHistory);
  };

  const navigateToMapScreen = () => {
    navigation.navigate("MapScreen", {
      latitude: lat,
      longitude: long,
    });
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
  const postEvent = () => {
    if (data.token) {
      navigation.navigate("EventsHomeScreen");
    } else {
      Alert.alert(
        `${localized.t("REGISTRATION_REQUIRED")}`,
        `${localized.t("ONLY_A_REGISTERED")}`,
        [
          {
            text: `${localized.t("LOGIN")}`,
            onPress: () => {
              navigation.navigate("LoginScreen");
            },
            style: "default",
          },
          {
            text: `${localized.t("CANCEL")}`,
            onPress: () => {},
            style: "default",
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };

  const navigation: any = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <BackgroundImg />
        <StatusBar
          backgroundColor="auto"
          barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
        />
        <View style={{ zIndex: 1 }}>
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
              // defaultButtonText={"EN"}
              defaultButtonText={selectedLanguage.toUpperCase()}
              buttonTextAfterSelection={(itemValue, index) => {
                return languageName.toUpperCase();
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>

          <View style={{ flex: 1 }}>{appLoader(loc == true)}</View>

          <View style={[styles.headerContainer, { top: windowHeight - 340 }]}>
            <PrimaryButton
              title={localized.t("FIND_FOOD")}
              onPress={navigateToMapScreen}
              buttonStyle={myTheme.Button.buttonStyle}
              titleStyle={styles.titleStyle}
            />
            <PrimaryButton
              title={localized.t("POST_EVENT")}
              buttonStyle={styles.postEventButton}
              onPress={postEvent}
              titleStyle={styles.titleStyle}
            />
            <PrimaryButton
              title={localized.t("VOLUNTEER")}
              buttonStyle={[
                styles.postEventButton,
                { backgroundColor: "#5FBB3F" },
              ]}
              onPress={() => {
                if (data.isAuthenticated) {
                  if (volunteerData.length > 0 || donationData.length > 0) {
                    navigation.navigate("VolunteerHomeScreen");
                  } else {
                    navigation.navigate("IntroSlider");
                  }
                } else {
                  Alert.alert(
                    `${localized.t("REGISTRATION_REQUIRED")}`,
                    `${localized.t("ONLY_A_REGISTERED")}`,
                    [
                      {
                        text: `${localized.t("LOGIN")}`,
                        onPress: () => {
                          navigation.navigate("LoginScreen");
                        },
                        style: "default",
                      },
                      {
                        text: `${localized.t("CANCEL")}`,
                        onPress: () => {},
                        style: "default",
                      },
                    ],
                    {
                      cancelable: true,
                    }
                  );
                }
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
                {localized.t("ALREADY_HAVE_AN_ACCOUNT")}
              </Text>
            )}

            {data?.user?.name ? (
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontFamily: "OpenSans-bold",
                  marginBottom: h2dp(6),
                }}
              >
                {localized.t("WELCOME")}{" "}
                {data?.user?.name ? data?.user?.name : ""}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textDecorationLine: "underline",
                    fontFamily: "OpenSans-Bold",
                    marginBottom: h2dp(6),
                  }}
                >
                  {localized.t("SIGN_IN")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // height: "100%",
    // top:(windowHeight-50),
    // bottom: h2dp(55),
    position: "absolute",
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
    marginBottom: 20,
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
    fontWeight: "200",
    lineHeight: 35,
    fontFamily: "OpenSans-bold",
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
    marginTop: Platform.OS === "ios" ? h2dp(4.5) : h2dp(5),
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
