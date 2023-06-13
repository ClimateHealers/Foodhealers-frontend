import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import Svg, { Path, Ellipse } from "react-native-svg";
import {
  widthPercentageToDP as w2dp,
  heightPercentageToDP as h2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { loadFonts } from "../font";
import { localized } from "../locales/localization";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import PrimaryButton from "../Components/PrimaryButton";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { findFood } from "../redux/actions/findFoodaction";
import { Image } from "react-native-elements";

const MapScreen = ({ route }: any) => {
  const { location } = route.params;

  const startDate = moment(new Date().setHours(0, 0, 0, 0)).utc().unix();
  const endDate = moment(new Date().setHours(23, 59, 59, 1000))
    .add(5, "d")
    .utc()
    .unix();

  console.log("checking curretn datetime", startDate, endDate);

  // console.log("mapsscreennnnnnnnnnn", location);
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
  const [events, setEvents] = useState([]);
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
  const mapRef = useRef<any>(null);

  const dispatch = useDispatch();

  // console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", events);

  // const EventDetails = useSelector(
  //   (state: any) => state.findFood.data.foodEvents
  // );
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );
  console.log("checking auth data in map screen", isAuthenticated);

  // console.log("checking data from the food reducer", EventDetails);

  const focusMarker = () => {
    if (mapRef.current) {
      const markerCoordinate = { latitude: lat, longitude: long };

      const region = {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      // Animate the map to the specified region
      mapRef.current.animateToRegion(region, 2000);
    }
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemPress = (item: any) => {
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };
  const findFoodMenuItemPress = (item: any) => {
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
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

  const navigateToEvent = (event: any) => {
    Alert.alert(
      "Navigate to event",
      "Do you want to navigate to google maps ?",
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
        <View style={styles.container}>
          <SafeAreaView>
            {menuOpen && (
              <View
                style={{
                  position: "absolute",
                  right: 60,
                  top: 145,
                  backgroundColor: "white",
                  borderColor: "white",
                  height: 100,
                  borderRadius: 5,
                  zIndex: 9999,
                  // elevation:0
                }}
              >
                <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
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
              </View>
            )}
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
              </View>
            </View>

            <GooglePlacesAutocomplete
              placeholder={localized.t("Address or nearest cross streets")}
              // currentLocation={true}
              onPress={async (data, details) => {
                console.log("checking data from google places", details);
                setAddress(details);
                setLat(details?.geometry?.location?.lat);
                setLong(details?.geometry?.location?.lng);
                setButtonVisibility(true);
                setfullAddress(details?.formatted_address);
                const addressComponents = details?.address_components || [];
                addressComponents.forEach((component) => {
                  if (component.types.includes("administrative_area_level_1")) {
                    const state = component.long_name;
                    console.log("State:", state);
                    setState(state);

                 
                  }

                  if (component.types.includes("locality")) {
                    const city = component.long_name;
                    console.log("City:", city);
                    setCity(city);
                  }

                  if (component.types.includes("postal_code")) {
                    const postalCode = component.long_name;
                    console.log("Postal Code:", postalCode);
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

                  // eventStartDate: 1685351184,
                  eventEndDate: endDate,
                  // eventEndDate: 1685610384,
                };

                const response = await dispatch(
                  findFood(findFoodData as any) as any
                );
                console.log(
                  "checking response of findFood API",
                  response?.payload?.foodEvents
                );
                setEvents(response?.payload?.foodEvents);
              }}
              fetchDetails={true}
              textInputProps={{ placeholderTextColor: "#000000" }}
              listUnderlayColor="blue"
              query={{
                key: "AIzaSyBgYGulsDfu4VFt_tcPfQwAPjZccMe7nA0",
                // key: "AIzaSyDRj8-ZV2Soyar4D5ksAcf5ILW8JKH-eh0",
                language: "en",
              }}
              styles={{
                textInputContainer: {
                  borderColor: "black",
                  borderRadius: 3,
                  marginTop: 12,
                  height: 50,
                  width: "92%",
                  marginLeft: 15,
                  marginBottom: 1,
                  zIndex: 9999,
                },
                description: {
                  color: "black",
                  fontSize: 14,
                  width: "80%",
                  zIndex: 9999,
                },
                listView: {
                  width: "92%",
                  marginLeft: 15,
                  borderRadius: 3,
                  // height: "5%",
                  zIndex: 9999,
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
                  zIndex: 9999,
                },

                predefinedPlacesDescription: { color: "#FFFFFF" },
              }}
            />

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
                followsUserLocation={true}
              >
                {/* <Circle
                  center={{
                    latitude: location?.coords?.latitude,
                    longitude:location?.coords?.longitude,
                  }}
                  radius={100}
                  strokeWidth={2}
                  strokeColor="#3399ff"
                  fillColor="#91c5fa"
                /> */}
                {/* <Circle
                  center={{
                    latitude: lat,
                    longitude: long,
                  }}
                  radius={500}
                  strokeWidth={2}
                  strokeColor="#3399ff"
                  fillColor="#91c5fa"
                /> */}

                {address ? (
                  <Marker
                    pinColor="#FC5A56"
                    coordinate={{
                      latitude: lat,
                      longitude: long,
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
                  // console.log("checking evetns", marker);
                  const coordinates = {
                    latitude: marker?.address?.lat,
                    longitude: marker?.address?.lng,
                  };
                  return (
                    <Marker
                      key={marker?.id}
                      pinColor="#00693D"
                      coordinate={coordinates}
                      onPress={() => navigateToEvent(coordinates)}
                      // title={marker?.title}
                      // description={marker?.name}
                      // identifier={marker?.name}
                    >
                      <View>
                        <Text style={{ color: "#00693D", fontSize: 10 }}>
                          {marker?.name}
                        </Text>
                        <Image
                          source={require("../../assets/eventLocationPin.png")}
                          style={styles.markerIcon}
                        />
                      </View>
                      {/* <Callout>
                        <View>
                          <Text>{marker?.name}</Text>
                        </View>
                      </Callout> */}
                    </Marker>
                  );
                })}
              </MapView>
            </View>
            {buttonVisibility ? (
              <View style={{ marginTop: -55 }}>
                <PrimaryButton
                  title={"Next"}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={() => clickHandler()}
                />
              </View>
            ) : null}
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
  },
  item: {
    width: "30%",
    marginTop: 25,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
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
    // marginTop: 100,
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
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: w2dp("40%"),
    marginBottom: 25,
    // marginLeft: 85,
    alignSelf: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
