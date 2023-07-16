import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import { widthPercentageToDP as w2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControlTab from "react-native-segmented-control-tab";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import { localized } from "../locales/localization";
import { findFood } from "../redux/actions/findFoodaction";
import { setLanguage } from "../redux/reducers/langReducer";

const WeekScreen = ({ route }: any) => {
  const { location, city, postalCode, state, fullAddress } = route.params;
  const { width, height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [langOpen, setlangOpen] = useState(false);
  const [events, setEvents] = useState([]);
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [activeButton, setActiveButton] = useState("Today");
  const [long, setLong] = useState<any>();
  const mapRef = useRef<any>(null);
  const dispatch = useDispatch();
  const languageName = useSelector((state:any) => state.language)


  const startDate = moment(new Date().setHours(0, 0, 0, 0)).utc().unix();
  const endDate = moment(new Date().setHours(23, 59, 59, 0)).utc().unix();

  const oneWeek = moment(new Date().setHours(23, 59, 59, 0))
    .add(6, "d")
    .utc()
    .unix();

  const gettingEvents = async () => {
    const findFoodData = {
      lat: location?.coords?.latitude ? location?.coords?.latitude : 0,
      lng: location?.coords?.longitude ? location?.coords?.longitude : 0,
      alt: 0,
      city: city,
      state: state,
      postalCode: postalCode ? Number(postalCode) : 0,
      fullAddress: fullAddress,
      eventStartDate: startDate ? startDate : 0,
      eventEndDate: endDate ? endDate : 0,
    };
    console.log(".....................", findFoodData);

    const response = await dispatch(findFood(findFoodData as any) as any);

    const foodEvents = response?.payload?.foodEvents;
    const verifiedFoodEvents = foodEvents?.filter(
      (event: any) => event.status === "approved"
    );
    console.log(
      "checking events from find food api that are approved in week screen",
      verifiedFoodEvents
    );
    setEvents(verifiedFoodEvents);
  };

  const navigateToEvent = (eventData: any) => {
    navigation.navigate("EventDetailsScreen", {
      eventDetails: eventData,
    });
  };

  useEffect(() => {
    gettingEvents();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      const oneDayData = {
        lat: location?.coords?.latitude ? location?.coords?.latitude : 0,
        lng: location?.coords?.longitude ? location?.coords?.longitude : 0,
        alt: 0,
        city: city,
        state: state,
        postalCode: postalCode ? Number(postalCode) : 0,
        fullAddress: fullAddress,
        eventStartDate: startDate ? startDate : 0,
        eventEndDate: endDate ? endDate : 0,
      };
      console.log("checking one day data", oneDayData);
      const response = await dispatch(findFood(oneDayData as any) as any);
      const foodEvents = response?.payload?.foodEvents;
      const verifiedFoodEvents = foodEvents?.filter(
        (event: any) => event.status === "approved"
      );
      setEvents(verifiedFoodEvents);
    } else if (index === 1) {
      const thisWeekData = {
        lat: location?.coords?.latitude ? location?.coords?.latitude : 0,
        lng: location?.coords?.longitude ? location?.coords?.longitude : 0,
        alt: 0,
        city: city,
        state: state,
        postalCode: postalCode ? Number(postalCode) : 0,
        fullAddress: fullAddress,
        eventStartDate: startDate ? startDate : 0,
        eventEndDate: oneWeek ? oneWeek : 0,
      };
      const response = await dispatch(findFood(thisWeekData as any) as any);
      const foodEvents = response?.payload?.foodEvents;
      const verifiedFoodEvents = foodEvents?.filter(
        (event: any) => event.status === "approved"
      );
      setEvents(verifiedFoodEvents);
    }
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(false);
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage))
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#012e17", "#017439", "#009b4d"]}
        style={styles.background}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <SafeAreaView>
            <View style={styles.row}>
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
                  defaultButtonText={languageName.toUpperCase()}
                  buttonTextAfterSelection={(itemValue, index) => {
                    return lang[index].value.toUpperCase();
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>
              <View style={styles.item}>
                <Text style={styles.itemText}>{localized.t("Find Food")}</Text>
              </View>
              <View style={styles.item}>
                <BurgerIcon />
              </View>
            </View>

            <View style={styles.toggle}>
              <SegmentedControlTab
                values={["Today", "All Days"]}
                selectedIndex={selectedIndex}
                tabsContainerStyle={{
                  width: 200,
                  height: 50,
                  zIndex: 1,
                }}
                tabTextStyle={{
                  color: "black",
                  fontWeight: "400",
                }}
                tabStyle={styles.tabStyle}
                activeTabStyle={{
                  backgroundColor: "#EDC258",
                }}
                activeTabTextStyle={{ color: "black" }}
                onTabPress={handleSingleIndexSelect}
              />
            </View>

            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={"google"}
                style={{ alignSelf: "stretch", height: "65%" }}
                initialRegion={{
                  latitude: location?.coords?.latitude,
                  longitude: location?.coords?.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                showsUserLocation={true}
              >
                {events?.map((marker: any) => {
                  const coordinates = {
                    latitude: marker?.address?.lat,
                    longitude: marker?.address?.lng,
                  };
                  return (
                    <Marker
                      key={marker?.id}
                      pinColor="#00693D"
                      coordinate={coordinates}
                      onPress={() => navigateToEvent(marker)}
                    >
                      <View>
                        <Text
                          style={{
                            color: "#FC5A56",
                            fontSize: 15,
                            opacity: 0.8,
                            fontWeight: "500",
                          }}
                        >
                          {marker?.name}
                        </Text>
                        <Image
                          source={require("../../assets/eventLocationPin.png")}
                          style={styles.markerIcon}
                        />
                      </View>
                    </Marker>
                  );
                })}
              </MapView>
            </View>
          </SafeAreaView>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    // flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    zIndex: 9999,
  },
  item: {
    width: "30%",
    marginTop: 25,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  dropdownContainer: {
    marginTop: 15,
    marginLeft: 15,
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  input: {
    height: 45,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    marginTop: 30,
    fontFamily: "OpenSans-Medium",
    zIndex: 9999,
  },
  mapContainer: {
    marginTop: 50,
  },
  dropdown1BtnStyle: {
    marginTop: 15,
    marginLeft: 45,
    width: "70%",
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
  buttonStyles: {
    backgroundColor: "#EDC258",
    color: "black",
    width: w2dp("24%"),
    // marginLeft: 15,
    alignSelf: "center",
    borderTopEndRadius: 0,
  },
  newButtonStyles: {
    backgroundColor: "#FFFFFF",
    color: "black",
    width: w2dp("24%"),
    alignSelf: "center",
    borderTopEndRadius: 0,
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },

  blueDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.7)",
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 45,
    marginLeft: 15,
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  tabStyle: {
    borderColor: "#EDC258",
  },
  activeTabStyle: {
    backgroundColor: "#EDC258",
    color: "black",
  },
});

export default WeekScreen;
