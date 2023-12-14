import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/GetCurrentLocation";
import { localized } from "../locales/localization";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useDispatch } from "react-redux";
import { Asset } from "expo-asset";
import * as Clipboard from "expo-clipboard";
import { GetEventVolunteers } from "../redux/actions/eventVolunteers";

const VolunteerSingleEventDetails = ({ route }: any) => {
  const { eventDetails } = route.params;
  const navigation: any = useNavigation();
  const [base64String, setbase64String] = useState<any>();
  const [menuClose, setMenuOpen] = useState(false);
  const [langOpen, setlangOpen] = useState(false);
  const [eventVolunteersData, setEventVolunteersData] = useState<[]>([]);
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
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    fetchEventVolunteers();
  }, []);
  const fetchEventVolunteers = async () => {
    try {
      const eventVolunteerData = await dispatch(
        GetEventVolunteers(eventDetails.id) as any
      );
      setEventVolunteersData(eventVolunteerData?.payload?.EventVolunteers);
    } catch (error) {
      console.error(error);
    }
  };
  const volunteerNumber = eventVolunteersData?.length
    ? eventVolunteersData?.length
    : 0;

  const startTime = eventDetails?.eventStartDate;
  const formattedStartTime = moment(startTime).format("h:mm a");

  const EndTime = eventDetails?.eventEndDate;
  const formattedEndTime = moment(EndTime).format("h:mm a");

  const imagePath = eventDetails?.eventPhoto;

  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const asset = Asset.fromModule(imagePath);
        await asset.downloadAsync();

        const fileUri = asset.localUri || asset.uri;
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setbase64String(`${base64}`);
      } catch (error) {
        console.error("Error converting to base64:", error);
      }
    };

    convertToBase64();
  }, [imagePath]);

  const saveBase64AsFile = async (base64String: any) => {
    const path = FileSystem.cacheDirectory + "image.jpg";
    try {
      await FileSystem.writeAsStringAsync(path, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return path;
    } catch (error) {
      console.error("Error saving base64 as file:", error);
      return null;
    }
  };

  const shareAsSocialPost = async () => {
    const imageUrl = base64String;
    const localUri: any = await saveBase64AsFile(base64String);
    const message: any = `I'm Volunteering ${eventDetails?.name} Event.

From ${moment(eventDetails?.eventStartDate).format(
      "D MMM, ddd"
    )} around ${formattedStartTime} onwards at ${eventDetails?.address}

Join me using https://play.google.com/store/apps/details?id=com.foodhealers.climatehealers.`;
    try {
      await Clipboard.setStringAsync(message);
      await Sharing.shareAsync(localUri, {
        mimeType: "image/jpeg",
        dialogTitle: message,
        UTI: "image/jpeg",
      });
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
    }
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  const navigationHandler = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${eventDetails?.lat},${eventDetails?.long}`;
    Linking.openURL(url);
  };

  const expired = moment(eventDetails?.eventEndDate).isBefore(moment());
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{eventDetails.name}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: expired ? "#bab7b6" : "white",
                    borderRadius: h2dp(1),
                  },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: eventDetails?.eventPhoto }}
                    style={{
                      width: "100%",
                      height: 250,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      opacity: expired ? 0.3 : 1,
                    }}
                  />
                </View>
                <View style={{ marginTop: h2dp(3) }}>
                  <View
                    style={{
                      marginBottom: h2dp(2),
                      paddingHorizontal: w2dp(1),
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("FROM")}:
                      <Text style={styles.cardText}>
                        {" "}
                        {moment(eventDetails?.eventStartDate).format(
                          "ddd, MMM D"
                        )}{" "}
                        {formattedStartTime}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                    <Text style={styles.boldText}>
                      {localized.t("TO")}:{" "}
                      <Text style={styles.cardText}>
                        {moment(eventDetails?.eventEndDate).format(
                          "ddd, MMM D"
                        )}{" "}
                        {formattedEndTime}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                    <Text style={styles.boldText}>
                      {localized.t("LOCATION")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails.address}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp("2%"),
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("WHAT")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails?.additionalInfo}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: h2dp("2%"),
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.boldText}>
                      {localized.t("VOLUNTEERS_REQUIRED")}:{" "}
                      <Text style={styles.cardText}>
                        {eventDetails?.requiredVolunteers}
                      </Text>
                    </Text>

                    <Divider
                      style={{
                        backgroundColor: "black",
                        height: 1,
                        width: "95%",
                      }}
                    />
                  </View>
                </View>
              </View>
              <View>
                {eventDetails?.map ? (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PrimaryButton
                      disabled={expired}
                      title={
                        expired
                          ? `${localized.t("EVENT_EXPIRED")}`
                          : `${localized.t("GET_DIRECTIONS")}`
                      }
                      onPress={navigationHandler}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                    />
                    <PrimaryButton
                      disabled={expired}
                      title={localized.t("SHARE")}
                      onPress={() => {
                        Alert.alert(
                          `Text/Caption Copied to Clipboard`,
                          `Text/Caption copied to clipboard. Please paste while sharing`,
                          [
                            {
                              text: "OK",
                              onPress: () => {
                                shareAsSocialPost();
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      }}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PrimaryButton
                      disabled={expired}
                      title={
                        expired
                          ? `${localized.t("EVENT_EXPIRED")}`
                          : `Volunteers (${volunteerNumber})`
                      }
                      onPress={() => {
                        handlePressOutside(),
                          volunteerNumber
                            ? navigation.navigate("AllVolunteersScreen", {
                                eventId: eventDetails?.id,
                                title: `${localized.t("VOLUNTEER_AT_EVENT")}`,
                                itemTypeId: 3,
                                eventVolunteersData: eventVolunteersData,
                              })
                            : null;
                      }}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                    />
                    <PrimaryButton
                      disabled={expired}
                      title={localized.t("SHARE")}
                      onPress={() => {
                        Alert.alert(
                          `Text/Caption Copied to Clipboard`,
                          `Text/Caption copied to clipboard. Please paste while sharing`,
                          [
                            {
                              text: "OK",
                              onPress: () => {
                                shareAsSocialPost();
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      }}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerSingleEventDetails;
