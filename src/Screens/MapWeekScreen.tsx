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
  Alert,
  Linking,
} from "react-native";
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
import { Button, Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { findFood } from "../redux/actions/findFoodaction";
import moment from "moment";
import SegmentedControlTab from "react-native-segmented-control-tab";

const MapWeekScreen = ({ route }: any) => {
  const { location } = route.params;
  const { width, height } = Dimensions.get("window");
  const navigation: string = useNavigation();
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

//   const eventData = useSelector((state: any) => state.findFood.data.foodEvents);
//   console.log("ppppppppppppppppppppppppp", eventData);
  //   setSelectedIndex(1)

  //   const presentDate = moment().format("YYYY-MM-DD")
  const startDate = moment(new Date().setHours(0, 0, 0, 0)).utc().unix();
  const endDate = moment(new Date().setHours(23, 59, 59, 1000))
    .add(1, "d")
    .utc()
    .unix();

  const oneWeek = moment(new Date().setHours(23, 59, 59, 1000))
    .add(5, "d")
    .utc()
    .unix();

  console.log("checking curretn datetime", startDate, endDate);
  const gettingEvents = async () => {
    const findFoodData = {
      lat: location?.coords?.latitude,
      lng: location?.coords?.longitude,
      alt: 0,
      eventStartDate: startDate,
      eventEndDate: endDate,
    };

    const response = await dispatch(findFood(findFoodData) as any);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqq", response?.payload);
    setEvents(response?.payload?.foodEvents);
  };

  const navigateToEvent = (eventData: any) => {
 
    navigation.navigate("EventDetailsScreen",{
        eventDetails:eventData
    });
  };

  useEffect(() => {
    gettingEvents();
  }, []);

  //   const focusMarker = () => {
  //     if (mapRef.current) {
  //       const markerCoordinate = { latitude: lat, longitude: long };

  //       const region = {
  //         latitude: markerCoordinate.latitude,
  //         longitude: markerCoordinate.longitude,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       };

  //       // Animate the map to the specified region
  //       mapRef.current.animateToRegion(region, 1000);
  //     }
  //   };

  const handleButtonClick = async (buttonTitle: any) => {
    setActiveButton(buttonTitle);

    const thisWeekData = {
      lat: location?.coords?.latitude,
      lng: location?.coords?.longitude,
      alt: 0,
      eventStartDate: startDate,
      eventEndDate: oneWeek,
    };
    const result = await dispatch(findFood(thisWeekData) as any);
    setEvents(result?.payload?.foodEvents);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleSingleIndexSelect = async (index: any) => {
    // For single Tab Selection SegmentedControlTab
    setSelectedIndex(index);
    console.log("ccccccccccccccccccccccccccccccccc");
    const thisWeekData = {
      lat: location?.coords?.latitude,
      lng: location?.coords?.longitude,
      alt: 0,
      eventStartDate: startDate,
      eventEndDate: oneWeek,
    };
    const result = await dispatch(findFood(thisWeekData) as any);
    setEvents(result?.payload?.foodEvents);
    console.log(",,,,,,,,,,,,,,,,,,,,,,,", result?.payload?.foodEvents);
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const handleMenuItemPress = (item: any) => {
    console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("SignupScreen");
  };

  const [isFocused, setIsFocused] = useState(false);

  // const handleFocus = () => setIsFocused(true);
  // const handleBlur = () => setIsFocused(false);

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  //   useEffect(() => {
  //     if (lat && long) {
  //       focusMarker();
  //     }
  //   }, [lat, long]);

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
                      fontWeight: 300,
                      lineHeight: 27.24,
                    }}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMenuItemPress("Find Food")}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: 300,
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
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="white"
                  onPress={toggleMenu}
                />
              </View>
            </View>

            <View style={styles.toggle}>
              {/* <PrimaryButton
                title={"Today"}
                // buttonStyle={styles.buttonStyles}
                buttonStyle={
                  activeButton === "Today"
                    ? styles.buttonStyles
                    : styles.newButtonStyles
                }
                titleStyle={styles.title}
                onPress={() => handleButtonClick("Today")}
              />
              <PrimaryButton
                title={"This week"}
                // buttonStyle={styles.newButtonStyles}
                buttonStyle={
                  activeButton === "This week"
                    ? styles.buttonStyles
                    : styles.newButtonStyles
                }
                titleStyle={styles.title}
                onPress={() => handleButtonClick("This week")}
              /> */}
              {/* <SegmentedControlTab
          values={["Today", "This week"]}
         
          tabsContainerStyle = {{
            width:200,
            height:50,
            // backgroundColor: '#F2F2F2'
            
          }}
        //   firstTabStyle = {{
        //     backgroundColor:"#EDC258",
        //     borderWidth: 0,
        //     borderColor: 'transparent'
        //   }}
        //   lastTabStyle = {{
        //     backgroundColor:"#FFFFFF",
        //     borderWidth: 0,
        //     borderColor: 'transparent'
        //   }}
          activeTabStyle={{ backgroundColor: '#EDC258' }}
        //   tabTextStyle={{ color: '#444444', fontWeight: 'bold' }}
          activeTabTextStyle={{ color: 'black' }}
       
        /> */}
              <SegmentedControlTab
                values={["Today", "This week"]}
                selectedIndex={selectedIndex}
                tabsContainerStyle={{
                  width: 200,
                  height: 50,
                  // backgroundColor: '#FFFFFF'
                }}
                tabTextStyle={{
                  color: "#444444",
                  fontWeight: "bold",
                //   fontSize: 16,
                //   fontWeight: "400",
                //   lineHeight: 35,
                //   fontFamily: "OpenSans-Regular",
                }}
                tabStyle={styles.tabStyle}
                activeTabStyle={styles.activeTabStyle}
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
                  console.log("checking evetns", marker?.name);
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
    color: "black",
  },
  activeTabStyle: {
    backgroundColor: "#EDC258",
  },
});

export default MapWeekScreen;
