import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import mapStyle from "../Components/MapStyle";
import { localized } from "../locales/localization";
import { VeganRecipesCategories } from "../redux/actions/veganRecipes";

const FindFoodHomeScreen = ({ route }: any) => {
  const {
    currentlat,
    currentlong,
    city,
    postalCode,
    state,
    fullAddress,
    latitude,
    lng,
    address,
  } = route.params;
  const menuItem = "Find Food";
  const [menuClose, setMenuOpen] = useState(false);
  const { width, height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [langOpen, setlangOpen] = useState(false);
  const [events, setEvents] = useState<[]>([]);

  const mapRef = useRef<any>(null);
  const dispatch = useDispatch();

  const focusMarker = () => {
    if (mapRef.current) {
      const markerCoordinate = { latitude: latitude, longitude: lng };

      const region = {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      mapRef.current.animateToRegion(region, 2000);
    }
  };

  const fetchRecipesCategories = async () => {
    await dispatch(VeganRecipesCategories() as any);
    navigation.navigate("RecipesHomeScreen");
  };

  setTimeout(() => {
    if (latitude && lng) {
      focusMarker();
    }
  }, 500);

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  
  const clickHandler = () => {
    navigation.navigate("WeekScreen", {
      currentlatitude: currentlat,
      currentlongitude: currentlong,
      city: city,
      state: state,
      fullAddress: fullAddress,
      postalCode: postalCode,
      lat: latitude,
      lng: lng,
      address: address,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#012e17", "#017439", "#009b4d"]}
        style={styles.background}
      >
        <ScrollView keyboardShouldPersistTaps="always">
          <SafeAreaView style={styles.container}>
            <FoodhealersHeader />
            <View style={styles.row}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => {navigation.goBack(),handlePressOutside()}}
              />
              <View style={styles.item}>
                <Text style={styles.itemText}>{localized.t("FIND_FOOD")}</Text>
              </View>
              <BurgerIcon 
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                  menuItem={menuItem}/>
            </View>
            <TouchableOpacity
              style={[styles.touchableView]}
              onPress={() => { 
                handlePressOutside(),
                clickHandler()
              }}
            >
              <View style={[styles.mapcontainerView]}>
                <MapView
                  ref={mapRef}
                  provider={"google"}
                  style={{
                    position: "relative",
                    alignSelf: "center",
                    height: Platform.OS === "ios" ? "100%" : "100%",
                    width: Platform.OS === "ios" ? "100%" : "100%",
                    borderRadius: 15,
                  }}
                  initialRegion={{
                    latitude: currentlat,
                    longitude: currentlong,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  showsUserLocation={true}
                  customMapStyle={mapStyle}
                >
                  <Marker
                    pinColor="#FC5A56"
                    coordinate={{
                      latitude: latitude ? latitude : 0,
                      longitude: lng ? lng : 0,
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
                        style={{ borderRadius: 20 }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "#FC5A56",
                              fontSize: h2dp(1.5),
                              opacity: 0.8,
                              fontWeight: "500",
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
            </TouchableOpacity>

            <View
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[styles.touchableView]}
                onPress={() =>{ 
                  handlePressOutside(),
                  navigation.navigate("CalendarScreen", {
                    latitude: latitude,
                    longitude: lng,
                  })
                }}
              >
                <View
                  style={[styles.containerView, { marginBottom: w2dp(2.8) }]}
                >
                  <Image
                    source={require("../../assets/images/eventsCalendar.png")}
                    style={styles.viewIcon}
                  />

                  <Text
                    style={{
                      marginLeft: w2dp(6),
                      fontSize: h2dp(2.5),
                      fontWeight: "500",
                    }}
                  >
                    {localized.t("FOOD_EVENTS_CALENDAR")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.touchableView]}
                onPress={()=>{
                  handlePressOutside(),
                  fetchRecipesCategories()
                }}
              >
                <View
                  style={[styles.containerView, { marginBottom: w2dp(2.8) }]}
                >
                  <Image
                    source={require("../../assets/recipesIcon.png")}
                    style={styles.recipeIcon}
                  />

                  <Text
                    style={{
                      marginLeft: w2dp(6),
                      fontSize: h2dp(2.5),
                      fontWeight: "500",
                    }}
                  >
                    {localized.t("VEGAN_RECIPES")}
                  </Text>
                </View>
              </TouchableOpacity>
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
    marginHorizontal: w2dp(4),
    alignItems: "center",
    flex: 1,
    height: h2dp("100%"),
    marginTop: h2dp(3),
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: w2dp(90),
    zIndex: 9999,
  },
  item: {
    height: 100,
    justifyContent: "center",
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
    fontSize: h2dp(2.5),
    color: "white",
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
  dropdown1BtnTxtStyle: { color: "#B50000", textAlign: "left", fontSize: h2dp(1.4) },
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
  dropdown1RowTxtStyle: { color: "black", textAlign: "center", fontSize: h2dp(1.0) },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    width: 190,
    alignSelf: "center",
  },

  titleStyle: {
    color: "white",
    fontSize: h2dp(2.6),
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
  viewIcon: {
    width: 80,
    height: 100,
    marginLeft: 5,
  },
  recipeIcon: {
    marginLeft: 5,
  },
  containerView: {
    height: "21%",
    borderRadius: 15,
    width: w2dp(90),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mapcontainerView: {
    height: "100%",
    borderRadius: 15,
    width: w2dp(90),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
  },
  touchableView: {
    height: h2dp(17),
    borderRadius: 15,
    marginTop: h2dp(4),
    width: w2dp(90),
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default FindFoodHomeScreen;
