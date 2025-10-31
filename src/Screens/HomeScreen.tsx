import { MaterialIcons } from "@expo/vector-icons";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  StatusBar,
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
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";
import { myDonations } from "../redux/actions/myDonations";
import { volunteerHistory } from "../redux/actions/volunteerHistoryAction";
import { setLanguage } from "../redux/reducers/langReducer";
import axios from "axios";
import { fetchUser, getExpoPushToken } from "../redux/actions/authAction";
import { Image } from "react-native-elements";
import { allRequests } from "../redux/actions/allRequests";
import { myRequests } from "../redux/actions/myRequests";

const HomeScreen = ({ route }: any) => {
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const languageName = useSelector((state: any) => state.language);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [loc, setLoc] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [donationData, setDonationData] = useState("");
  const [userData, setData] = useState<any>();
  const [volunteerData, setVolunteerData] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [lang] = useState([
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
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  useFocusEffect(
    useCallback(() => {
      const getUserLocation = async () => {
        setLoading(true);
        try {
          await fetchingDonationData();
          await fetchingvolunteerHistory();
          await fetchingUserData();
          await getPushToken();
          const response = await axios.get("http://ipinfo.io/json");
          const { loc } = response?.data;
          const [latitude, longitude] = loc
            .split(",")
            .map((coord: any) => parseFloat(coord));
          setLat(latitude);
          setLong(longitude);
          setLoading(false);
          return { latitude, longitude };
        } catch (error) {
          console.error("Error fetching user location", error);
          setLoading(false);
          return null;
        }
      };
      getUserLocation();
      setLoading(false);
    }, [])
  );
  const fetchingDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    setDonationData(response?.payload?.donationList);
  };

  const fetchingvolunteerHistory = async () => {
    const response = await dispatch(volunteerHistory({} as any) as any);
    setVolunteerData(response?.payload?.volunteerHistory);
  };

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };

  const getPushToken = async () => {
    await dispatch(getExpoPushToken({} as any) as any);
  };

  const navigateToMapScreen = () => {
    navigation.navigate("MapScreen", {
      latitude: lat,
      longitude: long,
    });
  };

  const navigateToFindFoodEventsScreen = () => {
    if (data.token) {
      navigation.navigate("FindFoodEventsScreen");
    } else {
      Alert.alert(
        `${localized.t("REGISTRATION_REQUIRED")}`,
        `${localized.t("ALERT_MESSAGE")}`,
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

  const postEvent = () => {
    if (data.token) {
      navigation.navigate("AllEventScreen");
    } else {
      Alert.alert(
        `${localized.t("REGISTRATION_REQUIRED")}`,
        `${localized.t("ALERT_MESSAGE")}`,
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

  const onRecipeClicked = () => {
    if (data.token) {
      navigation.navigate("RecipesHomeScreen");
    } else {
      Alert.alert(
        `${localized.t("REGISTRATION_REQUIRED")}`,
        `${localized.t("ALERT_MESSAGE")}`,
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
        <StatusBar
          backgroundColor="auto"
          barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
        />
        <ImageBackground
          source={require("../../assets/homeImage21.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.topContainer}>
            <View style={styles.dropdownContainer}>
              <SelectDropdown
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                renderDropdownIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={18}
                    color="#B50000"
                  />
                )}
                dropdownIconPosition="right"
                dropdownStyle={styles.dropdownStyle}
                rowStyle={styles.dropdownRowStyle}
                rowTextStyle={styles.dropdownRowTxtStyle}
                data={lang.map((dd) => dd.label)}
                onSelect={changeLanguage}
                defaultButtonText={selectedLanguage.toUpperCase()}
                buttonTextAfterSelection={() => languageName.toUpperCase()}
                rowTextForSelection={(item) => item}
              />
            </View>

            <View style={styles.banner}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/Food-Healers-Logo-preview.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Food Healers</Text>
              </View>
              <Text style={styles.subtitle}>Serving Free Plant-Based Food</Text>
            </View>
          </View>

          <Modal visible={loading} animationType="slide" transparent>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" />
              </View>
            </View>
          </Modal>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={localized.t("FIND_FOOD")}
              onPress={navigateToFindFoodEventsScreen}
              buttonStyle={styles.greenButton}
              titleStyle={styles.buttonTitle}
            />
            <PrimaryButton
              title={localized.t("EVENTS")}
              buttonStyle={styles.whiteButton}
              onPress={postEvent}
              titleStyle={[styles.buttonTitle, styles.greenText]}
            />
            <PrimaryButton
              title={localized.t("VOLUNTEER")}
              buttonStyle={styles.greenButton}
              onPress={() => {
                if (data.isAuthenticated) {
                  if (volunteerData?.length > 0 || donationData?.length > 0) {
                    navigation.navigate("VolunteerHomeScreen", {
                      latitude: lat,
                      longitude: long,
                    });
                  } else {
                    navigation.navigate("IntroSlider", {
                      latitude: lat,
                      longitude: long,
                    });
                  }
                } else {
                  Alert.alert(
                    `${localized.t("REGISTRATION_REQUIRED")}`,
                    `${localized.t("ALERT_MESSAGE")}`,
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
              titleStyle={styles.buttonTitle}
            />
            <PrimaryButton
              title={localized.t("RECIPES")}
              buttonStyle={styles.whiteButton}
              onPress={onRecipeClicked}
              titleStyle={[styles.buttonTitle, styles.greenText]}
            />

            {data?.user?.name ? (
              <Text style={styles.welcomeText}>
                {localized.t("WELCOME")} {userData?.name}
              </Text>
            ) : (
              <View style={styles.authPrompt}>
                <Text style={styles.authText}>
                  {localized.t("ALREADY_HAVE_AN_ACCOUNT")}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text
                    style={[styles.authText, styles.underline, styles.bold]}
                  >
                    {localized.t("SIGN_IN")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    justifyContent: "space-between",
  },
  topContainer: {
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? h2dp(5) : h2dp(3),
  },
  banner: {
    backgroundColor: "#e2eae5ff",
    padding: 16,
    borderRadius: 16,
    marginTop: h2dp(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: w2dp(70),
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D4739",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#2D4739",
    textAlign: "center",
  },
  logoImage: {
    width: w2dp(8),
    height: h2dp(6),
  },
  buttonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: h2dp(2),
    alignItems: "center",
  },
  dropdownContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? h2dp(1) : 0,
    right: w2dp(5),
    zIndex: 1,
  },
  dropdownBtnStyle: {
    width: w2dp(20),
    height: h2dp(5),
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdownBtnTxtStyle: {
    color: "#B50000",
    fontSize: h2dp(1.4),
  },
  dropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
  },
  dropdownRowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#D1D1D6",
  },
  dropdownRowTxtStyle: {
    color: "black",
    fontSize: h2dp(1.4),
  },
  greenButton: {
    backgroundColor: "#5FBB3F",
    borderRadius: 5,
    marginBottom: h2dp(2),
    minWidth: w2dp(50),
    height: h2dp(6),
  },
  whiteButton: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: h2dp(2),
    minWidth: w2dp(50),
    height: h2dp(6),
  },
  buttonTitle: {
    fontSize: h2dp(2.2),
    fontFamily: "OpenSans-Bold",
  },
  greenText: {
    color: "green",
  },
  welcomeText: {
    color: "white",
    fontSize: h2dp(1.8),
    marginVertical: h2dp(2),
    fontFamily: "OpenSans-Bold",
  },
  authPrompt: {
    alignItems: "center",
    marginBottom: h2dp(2),
  },
  authText: {
    color: "white",
    fontSize: h2dp(1.8),
    fontFamily: "OpenSans-Regular",
    marginBottom: h2dp(1),
  },
  underline: {
    textDecorationLine: "underline",
  },
  bold: {
    fontFamily: "OpenSans-Bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
});

export default HomeScreen;
