import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControlTab from "react-native-segmented-control-tab";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import mapStyle from "../Components/MapStyle";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { findFood } from "../redux/actions/findFoodaction";
import { setLanguage } from "../redux/reducers/langReducer";
import { configureStore } from "@reduxjs/toolkit";

const WeekScreen = ({ route }: any) => {
  const {
    city,
    postalCode,
    state,
    fullAddress,
    lat,
    lng,
    address,
    currentLatitude,
    currentLongitude,
  } = route.params;
  const { width, height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [menuClose, setMenuOpen] = useState(false);

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
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [currentLat, setCurrentlat] = useState(currentLatitude || 0);
  const [currentLong, setCurrentlong] = useState(currentLongitude || 0);
  const mapRef = useRef<any>(null);
  const dispatch = useDispatch();

  const languageName = useSelector((state: any) => state.language);

  const currentDate = moment(new Date()).format("YYYY-MM-DD");

  const startDate = moment(new Date(currentDate)).utc().unix();
  const endDate = moment(new Date(currentDate))
    .add(23.99, "hours")
    .utc()
    .unix();

  const oneWeek = moment(new Date().setHours(23, 59, 59, 0))
    .add(6, "d")
    .utc()
    .unix();
  const gettingEvents = async (latitude?: number, longitude?: number) => {
    const payload = {
      lat: latitude ?? lat ?? currentLatitude,
      lng: longitude ?? lng ?? currentLongitude,
      alt: 0,
      city,
      state,
      postalCode: postalCode ? Number(postalCode) : 0,
      fullAddress,
      eventStartDate: startDate,
      eventEndDate: selectedIndex === 1 ? oneWeek : endDate,
    };

    const response = await dispatch(findFood(payload as any) as any);
    const foodEvents = response?.payload?.results?.foodEvents;
    const verified = foodEvents?.filter((e: any) => e.status === "approved");
    setEvents(verified || []);
  };

  const navigateToEvent = (eventData: any) => {
    navigation.navigate("EventDetailsScreen", {
      eventDetails: eventData,
      lat,
      lng,
    });
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  const handleSingleIndexSelect = (index: any) => {
    setSelectedIndex(index);
    gettingEvents();
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(false);
  };

  useFocusEffect(
    useCallback(() => {
      gettingEvents();

      if (lat && lng && mapRef.current) {
        const region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    }, [lat, lng])
  );

  const fetchUserLocation = async () => {
    try {
      const checkingPermission = await Location.hasServicesEnabledAsync();
      if (checkingPermission) {
        let { status } = await Location?.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return null;
        }
        let location =
          Platform.OS === "ios"
            ? await Location.getLastKnownPositionAsync({})
            : await Location.getCurrentPositionAsync({});
        if (location) {
          return location;
        }
      } else {
        console.log("Location services are not enabled");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const focusCurrentLocation = async () => {
    const locationResult = await fetchUserLocation();
    let latitudeToUse = currentLatitude;
    let longitudeToUse = currentLongitude;

    if (locationResult) {
      latitudeToUse = locationResult.coords.latitude;
      longitudeToUse = locationResult.coords.longitude;
    }

    setCurrentlat(latitudeToUse);
    setCurrentlong(longitudeToUse);
    await gettingEvents(latitudeToUse, longitudeToUse);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latitudeToUse,
          longitude: longitudeToUse,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#012e17", "#017439", "#009b4d"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.container}>
              <StatusBar barStyle="light-content" />
              <FoodhealersHeader />
              <View style={styles.root}>
                <View style={[styles.dropdownContainer, { width: "30%" }]}>
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
                <View style={[styles.item, { marginLeft: w2dp(-15) }]}>
                  <Text style={styles.itemText}>
                    {localized.t("FIND_FOOD")}
                  </Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <SegmentedControlTab
                  values={[
                    `${localized.t("TODAY")}`,
                    `${localized.t("ALL_DAYS")}`,
                  ]}
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
              <View style={{ marginTop: h2dp(2) }}>
                <Text
                  style={[
                    styles.boldText,
                    {
                      color: "orange",
                      fontSize: h2dp(1.5),
                    },
                  ]}
                >
                  <Text style={styles.cardText}>
                    {localized.t("YOU_ARE_SEEING_EVENT_FOR")}{" "}
                  </Text>
                  {fullAddress}
                </Text>
                <TouchableOpacity onPress={focusCurrentLocation}>
                  <Text
                    style={{
                      color: "orange",
                      textDecorationLine: "underline",
                      marginTop: h2dp(1),
                      fontSize: h2dp(1.5),
                      fontWeight: "300",
                    }}
                  >
                    {localized.t("CLICK_HERE_TO_SEE_EVENT_IN_YOUR_LOCATION")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mapContainer}>
                <MapView
                  ref={mapRef}
                  style={{
                    alignSelf: "stretch",
                    height: "65%",
                    marginHorizontal: w2dp(-4),
                  }}
                  showsUserLocation={true}
                  customMapStyle={mapStyle}
                >
                  {lat && lng && (
                    <Marker
                      coordinate={{ latitude: lat, longitude: lng }}
                      title={localized.t("SELECTED_LOCATION")}
                    >
                      <Image
                        source={require("../../assets/newCurrentLocationPin.png")}
                        style={styles.markerIcon}
                      />
                    </Marker>
                  )}

                  {currentLat && currentLong && (
                    <Marker
                      coordinate={{
                        latitude: currentLat,
                        longitude: currentLong,
                      }}
                      title="Your Location"
                    >
                      <Image
                        source={require("../../assets/eventLocationPin.png")}
                        style={[styles.markerIcon, { tintColor: "#009b4d" }]}
                      />
                    </Marker>
                  )}

                  {events?.map((marker: any) => {
                    const coordinates = {
                      latitude: marker?.address?.lat,
                      longitude: marker?.address?.lng,
                    };
                    return (
                      <Marker
                        key={marker?.id}
                        coordinate={coordinates}
                        onPress={() => navigateToEvent(marker)}
                      >
                        <View>
                          <Text
                            style={{
                              color: "#FC5A56",
                              fontSize: h2dp(1.5),
                              opacity: 0.8,
                              fontWeight: "bold",
                            }}
                          >
                            {marker?.name}
                          </Text>
                          <Image
                            source={require("../../assets/lastEventLocationPin.png")}
                            style={styles.markerIcon}
                          />
                        </View>
                      </Marker>
                    );
                  })}
                </MapView>
              </View>

              {fullAddress ? (
                <View
                  style={{
                    marginTop: h2dp(2),
                    marginHorizontal: w2dp(5),
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    padding: h2dp(2),
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: h2dp(2),
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: h2dp(0.5),
                    }}
                  >
                    {localized.t("SELECTED_LOCATION")}
                  </Text>
                  <Text
                    style={{
                      fontSize: h2dp(1.8),
                      color: "#fff",
                      opacity: 0.9,
                      lineHeight: h2dp(2.4),
                    }}
                    numberOfLines={3}
                  >
                    {fullAddress}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default WeekScreen;
