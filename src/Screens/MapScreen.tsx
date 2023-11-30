import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { findFood } from "../redux/actions/findFoodaction";
import { setLanguage } from "../redux/reducers/langReducer";

const MapScreen = ({ route }: any) => {
  const { latitude, longitude } = route.params;
  const menuItem = "Find Food";
  const [menuClose, setMenuOpen] = useState(false);
  const startDate = moment(new Date().setHours(0, 0, 0, 0)).utc().unix();
  const endDate = moment(new Date().setHours(23, 59, 59, 0))
    .add(6, "d")
    .utc()
    .unix();

  const { width, height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [langOpen, setlangOpen] = useState(false);
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
  const [events, setEvents] = useState<[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);
  const [address, setAddress] = useState<any>();
  const [lat, setLat] = useState<any>();
  const [long, setLong] = useState<any>();
  const [buttonVisibility, setButtonVisibility] = useState(false);
  const [fullAddress, setfullAddress] = useState<any>("");
  const [city, setCity] = useState<any>("");
  const [state, setState] = useState<any>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [emptyEvents, setEmptyEvents] = useState<boolean>(false);

  const mapRef = useRef<any>(null);

  const API_KEY = Constants?.manifest?.extra?.googleMapsApiKey;

  const dispatch = useDispatch();
  const languageName = useSelector((state: any) => state.language);

  const focusMarker = () => {
    if (mapRef.current) {
      const markerCoordinate = { latitude: lat, longitude: long };

      const region = {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      mapRef.current.animateToRegion(region, 2000);
    }
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const clickHandler = () => {
    navigation.navigate("FindFoodHomeScreen", {
      currentlat: latitude,
      currentlong: longitude,
      city: city,
      state: state,
      fullAddress: fullAddress,
      postalCode: postalCode,
      latitude: lat,
      lng: long,
      address: address,
    });
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    dispatch(setLanguage(selectedLanguage));
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  useEffect(() => {
    if (lat && long) {
      focusMarker();
    }
  }, [lat, long]);

  const navigateToEvent = (event: any, eventName: any) => {
    Alert.alert(
      `${localized.t("NAVIGATE_TO")} ${eventName} ${localized.t("EVENT")}`,
      `${localized.t("DO_YOU_WANT_TO_NAVIGATE_TO_GOOGLE_MAPS")}`,
      [
        {
          text: `${localized.t("NAVIGATE")}`,
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${long}&destination=${event?.latitude},${event?.longitude}`;
            Linking.openURL(url);
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
                  menuItem={menuItem}
                />
              </View>

              <GooglePlacesAutocomplete
                placeholder={localized.t("ADDRESS_OR_NEAREST_CROSS_STREETS")}
                listHoverColor="red"
                onPress={async (data, details) => {
                  setAddress(details);
                  setLat(details?.geometry?.location?.lat);
                  setLong(details?.geometry?.location?.lng);
                  setButtonVisibility(true);
                  setfullAddress(details?.formatted_address);
                  const addressComponents = details?.address_components || [];
                  addressComponents.forEach((component) => {
                    if (
                      component.types.includes("administrative_area_level_1")
                    ) {
                      const state = component.long_name;
                      setState(state);
                    } else {
                      setState("");
                    }

                    if (component.types.includes("locality")) {
                      const city = component.long_name;
                      setCity(city);
                    } else {
                      setCity("");
                    }

                    if (component.types.includes("postal_code")) {
                      const postalCode = component.long_name;
                      setPostalCode(postalCode);
                    }
                  });
                  const findFoodData = {
                    lat: details?.geometry?.location?.lat
                      ? details?.geometry?.location?.lat
                      : 0,
                    lng: details?.geometry?.location?.lng
                      ? details?.geometry?.location?.lng
                      : 0,
                    alt: 0,
                    eventStartDate: startDate ? startDate : 0,
                    fullAddress: details?.formatted_address,
                    city: city,
                    state: state,
                    postalCode: postalCode ? Number(postalCode) : 0,

                    eventEndDate: endDate ? endDate : 0,
                  };

                  const response = await dispatch(
                    findFood(findFoodData as any) as any
                  );
                  const foodEvents = response?.payload?.results?.foodEvents;
                  const verifiedFoodEvents = foodEvents?.filter(
                    (event: any) => event.status === "approved"
                  );
                  if (verifiedFoodEvents?.length > 0) {
                    setEvents(verifiedFoodEvents);
                    setEmptyEvents(false);
                  } else {
                    setEmptyEvents(true);
                  }
                }}
                fetchDetails={true}
                textInputProps={{ placeholderTextColor: "#000000" }}
                listUnderlayColor="blue"
                query={{
                  key: API_KEY,
                  language: "en",
                }}
                styles={{
                  textInputContainer: {
                    borderColor: "black",
                    borderRadius: 3,
                    marginTop: 12,
                    width: "100%",
                  },
                  description: {
                    color: "black",
                    fontSize: 14,
                    width: "80%",
                  },
                  listView: {
                    width: "100%",
                    borderRadius: 3,
                    // zIndex: 100,
                  },
                  row: {
                    height: 40,
                  },
                  poweredContainer: {
                    display: "none",
                  },
                  textInput: {
                    color: "black",
                    height: 50,
                    backgroundColor: "white",
                    paddingLeft: 16,
                  },

                  predefinedPlacesDescription: { color: "#FFFFFF" },
                }}
              />

              <View
                style={[
                  styles.mapContainer,
                  {
                    marginHorizontal: w2dp(-4),
                  },
                ]}
              >
                <MapView
                  ref={mapRef}
                  provider={"google"}
                  style={{
                    alignSelf: "stretch",
                    height: Platform.OS === "ios" ? "55%" : "60%",
                  }}
                  initialRegion={{
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  showsUserLocation={true}
                  followsUserLocation={true}
                >
                  {address ? (
                    <Marker
                      pinColor="#FC5A56"
                      coordinate={{
                        latitude: lat ? lat : 0,
                        longitude: long ? long : 0,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
                      title={localized.t("SELECTED_LOCATION")}
                    >
                      <Image
                        source={require("../../assets/newCurrentLocationPin.png")}
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
                            source={require("../../assets/newEventLocationPin.png")}
                            style={styles.markerIcon}
                          />
                        </View>
                      </Marker>
                    );
                  })}
                </MapView>

                {emptyEvents ? (
                  <Text
                    style={{
                      marginTop: 5,
                      textAlign: "center",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    {localized.t("NO_EVENTS_FOUND")}
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginTop: 5,
                      textAlign: "center",
                      fontSize: 20,
                      color: "white",
                      opacity: 0,
                    }}
                  >
                    {localized.t("NO_EVENTS_FOUND")}
                  </Text>
                )}

                {emptyEvents ? (
                  <View>
                    <PrimaryButton
                      title={localized.t("HOME")}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                      onPress={() => navigation.navigate("HomeScreen")}
                    />
                  </View>
                ) : !emptyEvents && buttonVisibility ? (
                  <View>
                    <PrimaryButton
                      title={localized.t("NEXT")}
                      buttonStyle={styles.buttonStyles}
                      titleStyle={styles.titleStyle}
                      onPress={() => clickHandler()}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default MapScreen;
