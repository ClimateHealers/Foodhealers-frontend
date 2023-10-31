import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
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
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { findFood } from "../redux/actions/findFoodaction";
import { setLanguage } from "../redux/reducers/langReducer";

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
  const [currentLat, setCurrentlat] = useState(0);
  const [currentLong, setCurrentlong] = useState(0);
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
  const focusMarker = () => {
    if (mapRef.current) {
      const markerCoordinate = { latitude: lat, longitude: lng };

      const region = {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      mapRef.current.animateToRegion(region, 2000);
    }
  };
  if (lat && lng) {
    focusMarker();
  }

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
    let latitudeToUse, longitudeToUse;

    if (locationResult) {
      latitudeToUse = locationResult.coords.latitude;
      longitudeToUse = locationResult.coords.longitude;
    } else {
      latitudeToUse = currentLatitude;
      longitudeToUse = currentLongitude;
    }

    setCurrentlat(latitudeToUse);
    setCurrentlong(longitudeToUse);

    const CurrentLocationPayload = {
      lat: latitudeToUse,
      lng: longitudeToUse,
      alt: 0,
      city: city,
      state: state,
      postalCode: postalCode ? Number(postalCode) : 0,
      fullAddress: fullAddress,
      eventStartDate: startDate ? startDate : 0,
      eventEndDate: oneWeek ? oneWeek : 0,
    };
    const response = await dispatch(
      findFood(CurrentLocationPayload as any) as any
    );
    const foodEvents = response?.payload?.results?.foodEvents;
    const verifiedFoodEvents = foodEvents?.filter(
      (event: any) => event.status === "approved"
    );
    setEvents(verifiedFoodEvents);

    if (mapRef.current) {
      const markerCoordinate = {
        latitude: latitudeToUse,
        longitude: longitudeToUse,
      };

      const region = {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      mapRef.current.animateToRegion(region, 2000);
    }
  };

  const gettingEvents = async () => {
    const findFoodData = {
      lat: lat ? lat : 0,
      lng: lng ? lng : 0,
      alt: 0,
      city: city,
      state: state,
      postalCode: postalCode ? Number(postalCode) : 0,
      fullAddress: fullAddress,
      eventStartDate: startDate ? startDate : 0,
      eventEndDate: endDate ? endDate : 0,
    };

    const response = await dispatch(findFood(findFoodData as any) as any);

    const foodEvents = response?.payload?.results?.foodEvents;
    const verifiedFoodEvents = foodEvents?.filter(
      (event: any) => event.status === "approved"
    );
    setEvents(verifiedFoodEvents);
  };

  const navigateToEvent = (eventData: any) => {
    navigation.navigate("EventDetailsScreen", {
      eventDetails: eventData,
      lat: lat,
      lng: lng,
    });
  };

  useFocusEffect(
    useCallback(() => {
      gettingEvents();
    }, [])
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      const oneDayData = {
        lat: lat ? lat : 0,
        lng: lng ? lng : 0,
        alt: 0,
        city: city,
        state: state,
        postalCode: postalCode ? Number(postalCode) : 0,
        fullAddress: fullAddress,
        eventStartDate: startDate ? startDate : 0,
        eventEndDate: endDate ? endDate : 0,
      };
      const response = await dispatch(findFood(oneDayData as any) as any);
      const foodEvents = response?.payload?.results?.foodEvents;
      const verifiedFoodEvents = foodEvents?.filter(
        (event: any) => event.status === "approved"
      );
      setEvents(verifiedFoodEvents);
    } else if (index === 1) {
      const thisWeekData = {
        lat: lat ? lat : 0,
        lng: lng ? lng : 0,
        alt: 0,
        city: city,
        state: state,
        postalCode: postalCode ? Number(postalCode) : 0,
        fullAddress: fullAddress,
        eventStartDate: startDate ? startDate : 0,
        eventEndDate: oneWeek ? oneWeek : 0,
      };
      const response = await dispatch(findFood(thisWeekData as any) as any);
      const foodEvents = response?.payload?.results?.foodEvents;
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
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
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
                <BurgerIcon />
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
                      fontSize: 15,
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
                      fontSize: 15,
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
                  provider={"google"}
                  style={{
                    alignSelf: "stretch",
                    height: "65%",
                    marginHorizontal: w2dp(-4),
                  }}
                  showsUserLocation={true}
                >
                  {address ? (
                    <Marker
                      pinColor="#FC5A56"
                      coordinate={{
                        latitude: lat ? lat : 0,
                        longitude: lng ? lng : 0,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
                      title={localized.t("SELECTED_LOCATION")}
                    >
                      <Image
                        source={require("../../assets/currentLocationPin.png")}
                        style={styles.markerIcon}
                      />
                    </Marker>
                  ) : null}

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
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default WeekScreen;
