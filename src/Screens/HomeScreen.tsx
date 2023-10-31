import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";
import { myDonations } from "../redux/actions/myDonations";
import { volunteerHistory } from "../redux/actions/volunteerHistoryAction";
import { setLanguage } from "../redux/reducers/langReducer";
import axios from "axios";
import { fetchUser } from "../redux/actions/authAction";
import { allRequests } from "../redux/actions/allRequests";

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
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  const line_height_multiplier = 1.5;
  const default_font_size = 13;

  useFocusEffect(
    useCallback(() => {
      const getUserLocation = async () => {
        setLoading(true);
        try {
          await fetchingDonationData();
          await fetchingvolunteerHistory();
          await fetchingUserData();
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
      setLoading(true);
      getUserLocation();
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

  const navigateToMapScreen = () => {
    navigation.navigate("MapScreen", {
      latitude: lat,
      longitude: long,
    });
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
        <StatusBar
          backgroundColor="auto"
          barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
        />
        <ImageBackground
          source={require("../../assets/homeImage21.jpg")}
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
              defaultButtonText={selectedLanguage.toUpperCase()}
              buttonTextAfterSelection={(itemValue, index) => {
                return languageName.toUpperCase();
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
          <Modal visible={loading} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size={"large"} />
              </View>
            </View>
          </Modal>
          <View style={styles.headerContainer}>
            <PrimaryButton
              title={localized.t("FIND_FOOD")}
              onPress={navigateToMapScreen}
              buttonStyle={[
                styles.postEventButton,
                { backgroundColor: "#5FBB3F", marginTop: h2dp(4) },
              ]}
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
            <View style={{ marginBottom: h2dp(6) }}>
              {data?.user?.name ? (
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginBottom: h2dp(4),
                    fontFamily: "OpenSans-bold",
                  }}
                >
                  {localized.t("WELCOME")}{" "}
                  {data?.user?.name ? userData?.name : ""}
                </Text>
              ) : (
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: h2dp(1.8),
                      marginBottom: h2dp(1.5),
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {localized.t("ALREADY_HAVE_AN_ACCOUNT")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("LoginScreen")}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: h2dp(1.8),
                        textDecorationLine: "underline",
                        fontFamily: "OpenSans-Bold",
                        alignSelf: "center",
                      }}
                    >
                      {localized.t("SIGN_IN")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  postEventButton: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 5,
    marginBottom: h2dp(2),
    minWidth: 190,
    maxHeight: h2dp(6),
  },
  dropdownContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? h2dp(10) : h2dp(7),
    left: "10%",
    width: "70%",
  },
  titleStyle: {
    color: "black",
    fontSize: 22,
    fontWeight: "200",
    fontFamily: "OpenSans-bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: h2dp(2.2),
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
    height: h2dp(5),
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  dropdown1BtnTxtStyle: {
    color: "#B50000",
    textAlign: "left",
    fontSize: h2dp(1.4),
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
    color: "black",
    borderRadius: 4,
    height: 180,
    fontSize: h2dp(1.4),
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
