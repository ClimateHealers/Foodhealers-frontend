import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import { localized } from "../locales/localization";
import { findFood } from "../redux/actions/findFoodaction";
import { CommonActions } from "@react-navigation/native";
import { logOut } from "../redux/reducers/authreducers";

const MapScreen = ({ route }: any) => {
  const { location } = route.params;

  const startDate = moment(new Date().setHours(0, 0, 0, 0)).utc().unix();
  const endDate = moment(new Date().setHours(23, 59, 59, 1000))
    .add(5, "d")
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

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
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemPress = (item: any) => {
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
    });
    setMenuOpen(false);
  };
  const logout = async (item: any) => {
    // persistor.purge()
    await dispatch(logOut({}) as any);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  const clickHandler = () => {
    navigation.navigate("WeekScreen", {
      location: location,
      city: city,
      state: state,
      fullAddress: fullAddress,
      postalCode: postalCode,
    });
  };

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
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
      `Navigate to ${eventName} event`,
      "Do you want to navigate to Google maps ?",
      [
        {
          text: "Navigate",
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${event?.latitude},${event?.longitude}`;
            Linking.openURL(url);
          },
          style: "default",
        },
        {
          text: "Cancel",
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
        <ScrollView keyboardShouldPersistTaps="always">
          <SafeAreaView style={styles.container}>
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
                  defaultButtonText={"EN"}
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
                {/* <BurgerIcon/> */}
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="white"
                  onPress={() => toggleMenu()}
                />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: Platform.OS === "ios" ? h2dp(8) : h2dp(9),
                      backgroundColor: "white",
                      borderColor: "white",

                      borderRadius: 5,
                      zIndex: 9999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => findFoodMenuItemPress("Find Food")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Find Food
                      </Text>
                    </TouchableOpacity>
                    {isAuthenticated && (
                      <TouchableOpacity onPress={() => logout("logout")}>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 20,
                            fontWeight: "300",
                            lineHeight: 27.24,
                          }}
                        >
                          Log out
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>

            <GooglePlacesAutocomplete
              placeholder={localized.t("Address or nearest cross streets")}
              onPress={async (data, details) => {
                console.log("checking data from input...", data, details);
                setAddress(details);
                setLat(details?.geometry?.location?.lat);
                setLong(details?.geometry?.location?.lng);
                setButtonVisibility(true);
                setfullAddress(details?.formatted_address);
                const addressComponents = details?.address_components || [];
                addressComponents.forEach((component) => {
                  if (component.types.includes("administrative_area_level_1")) {
                    const state = component.long_name;
                    setState(state);
                  }

                  if (component.types.includes("locality")) {
                    const city = component.long_name;
                    setCity(city);
                  }

                  if (component.types.includes("postal_code")) {
                    const postalCode = component.long_name;
                    setPostalCode(postalCode);
                  }
                });
                const findFoodData = {
                  lat: details?.geometry?.location?.lat,
                  lng: details?.geometry?.location?.lng,
                  alt: 0,
                  eventStartDate: startDate,
                  fullAddress: details?.formatted_address,
                  city: city,
                  state: state,
                  postalCode: postalCode ? Number(postalCode) : 0,

                  eventEndDate: endDate,
                };

                const response = await dispatch(
                  findFood(findFoodData as any) as any
                );
                const foodEvents = response?.payload?.foodEvents;
                const verifiedFoodEvents = foodEvents?.filter(
                  (event: any) => event.status === "approved"
                );
                console.log(
                  "checking events from find food api that are approved",
                  verifiedFoodEvents
                );
                if (verifiedFoodEvents.length > 0) {
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
                key: API_KEY, //client
                language: "en",
              }}
              styles={{
                textInputContainer: {
                  borderColor: "black",
                  borderRadius: 3,
                  marginTop: 12,
                  width: "92%",
                  marginLeft: 15,
                  marginBottom: 1,
                },
                description: {
                  color: "black",
                  fontSize: 14,
                  width: "80%",
                },
                listView: {
                  width: "92%",
                  marginLeft: 15,
                  borderRadius: 3,
                  zIndex: 100,
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

            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={"google"}
                style={{
                  alignSelf: "stretch",
                  height: Platform.OS === "ios" ? "55%" : "60%",
                }}
                initialRegion={{
                  latitude: location?.coords?.latitude,
                  longitude: location?.coords?.longitude,
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
                    title={"selected location"}
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
                      onPress={() => navigateToEvent(coordinates, marker?.name)}
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

              {emptyEvents ? (
                <Text
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  No events found
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
                  No Events Found
                </Text>
              )}

              {emptyEvents ? (
                <View
                  style={{
                    position: "absolute",
                    top: Platform.OS === "ios" ? h2dp(40) : h2dp(48),
                    left: w2dp(26),
                  }}
                >
                  <PrimaryButton
                    title={"Home"}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                    onPress={() => navigation.navigate("HomeScreen")}
                  />
                </View>
              ) : !emptyEvents && buttonVisibility ? (
                <View>
                  <PrimaryButton
                    title={"Next"}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={styles.titleStyle}
                    onPress={() => clickHandler()}
                  />
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: h2dp("100%"),
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
    position: "relative",
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
  mapContainer: {},
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
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 190,
    alignSelf: "center",
  },

  titleStyle: {
    color: "white",
    fontSize: 26,
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
  markerIcon: {
    width: 40,
    height: 40,
  },
});

export default MapScreen;
