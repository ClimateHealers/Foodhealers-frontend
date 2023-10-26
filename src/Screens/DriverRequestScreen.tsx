import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { localized } from "../locales/localization";

import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { fetchVehicle } from "../redux/actions/addVehicle";
import { fetchUser, updatePhoto } from "../redux/actions/authAction";

const DriverRequestScreen = ({ route }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<any>();
  const [data, setData] = useState<any>();
  const date = new Date().getTime();
  const [image, setImage] = useState<any>();
  const navigation: any = useNavigation<string>();
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchingVehiclesData();
      fetchingUserData();
    }, [])
  );

  const dispatch = useDispatch();

  const fetchingVehiclesData = async () => {
    const response = await dispatch(fetchVehicle({} as any) as any);

    const indexLength = response?.payload?.vehicleDetails?.length;
    const data = response?.payload?.vehicleDetails[indexLength - 1];
    setVehicleDetails(data);
  };

  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };

  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };

  const openImagePickerAsync = async () => {
    const res = await MediaLibrary.requestPermissionsAsync();
    if (res.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const multipleImages = result.assets.map((image) => image.uri);
        const singlePhoto = result.assets[0].uri;
        const formData = new FormData();
        setImage(singlePhoto);
        formData.append("profilePhoto", {
          uri: singlePhoto,
          type: "image/jpeg",
          name: `${data?.name}${date}.jpg`,
        });
        try {
          setLoading(true);
          const response = await dispatch(updatePhoto(formData as any) as any);
          if (response?.payload?.success === true) {
            setLoading(false);
            setResponse({
              loading: false,
              message: `${localized.t("PHOTO_UPDATED")}`,
              error: true,
            });
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.log("ERROR", error);
        }
      }
    } else if (!res.granted) {
      Alert.alert(
        `${localized.t("MEDIA_LIBRARY_ACCESS")}`,
        `${localized.t("FOODHEALERS_APP_NEEDS_PHOTOLIBRARY.")}`,
        [
          {
            text: `${localized.t("OK")}`,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#ffffff", "#ffffff", "#ffffff"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.containerVolunteer}>
              <FoodhealersHeader />
              <View style={styles.rootVolunteerHome}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="#00693D"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={{ fontSize: 25, color: "#00693D" }}>
                    {localized.t("DRIVE")}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="menu"
                  size={40}
                  color="#00693D"
                  onPress={() => toggleMenu()}
                  style={{
                    zIndex: 9999,
                    right: 0,
                  }}
                />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 40,
                      top: 65,
                      backgroundColor: "white",
                      borderColor: "black",
                      borderWidth: 0.5,
                      borderRadius: 5,
                      zIndex: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
                      <Text style={styles.burgerText}>
                        {localized.t("HOME")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => findFoodMenuItemPress("Find Food")}
                    >
                      <Text style={styles.burgerText}>
                        {localized.t("FIND_FOOD")}
                      </Text>
                    </TouchableOpacity>
                    {isAuthenticated && (
                      <View>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("ProfileScreen")}
                        >
                          <Text style={styles.burgerText}>
                            {localized.t("ACCOUNT")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("TeamHomeScreen")}
                        >
                          <Text style={styles.burgerText}>
                            {localized.t("TEAM")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: h2dp(35),
                  width: h2dp(35),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginBottom: h2dp(3),
                  borderWidth: 2,
                }}
              >
                <TouchableOpacity onPress={openImagePickerAsync}>
                  {image ? (
                    <View>
                      <Image
                        source={{ uri: image }}
                        style={{ width: h2dp(35), height: h2dp(35) }}
                      />
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={{ uri: data?.profilePhoto }}
                        style={{ width: h2dp(35), height: h2dp(35) }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 36, color: "#00693D" }}>
                {localized.t("HELLO")}, {data?.name}
              </Text>
              <View
                style={{
                  backgroundColor: "#00693D",
                  borderRadius: 5,
                  width: w2dp(70),
                  marginTop: h2dp(5),
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    color: "white",
                    marginVertical: h2dp(1),
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {vehicleDetails?.make} {vehicleDetails?.model},{" "}
                  {vehicleDetails?.vehicleColour}, {vehicleDetails?.plateNumber}
                </Text>
                <PrimaryButton
                  title={localized.t("EDIT_VEHICLE_DETAILS")}
                  onPress={() => {
                    navigation.navigate("UpdateVehicleScreen", {
                      id: vehicleDetails?.id,
                      make: vehicleDetails?.make,
                      model: vehicleDetails?.model,
                      vehicleColour: vehicleDetails.vehicleColour,
                      plateNumber: vehicleDetails?.plateNumber,
                    });
                  }}
                  buttonStyle={{
                    backgroundColor: "#D1D1D6",
                    color: "white",
                    borderRadius: 5,
                    right: 0,
                    marginBottom: h2dp(2),
                    paddingHorizontal: w2dp(6),
                  }}
                  titleStyle={{
                    color: "black",
                    fontSize: 18,
                    lineHeight: 20,
                    fontFamily: "OpenSans-Regular",
                  }}
                />
              </View>
              <PrimaryButton
                title={localized.t("SEE_PICKUP_REQUESTS")}
                onPress={() =>
                  navigation.navigate("PickupDetailsScreen", {
                    itemTypeId: 4,
                  })
                }
                buttonStyle={{
                  backgroundColor: "#00693D",
                  color: "black",
                  borderRadius: 5,
                  width: w2dp(70),
                  marginTop: h2dp(5),
                  alignSelf: "center",
                }}
                titleStyle={[
                  styles.titleMainStyle,
                  {
                    color: "white",
                  },
                ]}
              />
              <PrimaryButton
                title={localized.t("HISTORY")}
                onPress={() =>
                  navigation.navigate("PickupHistoryScreen", {
                    itemTypeId: 4,
                  })
                }
                buttonStyle={{
                  backgroundColor: "#D1D1D6",
                  color: "black",
                  borderRadius: 5,
                  borderColor: "black",
                  borderWidth: 1,
                  width: w2dp(70),
                  marginTop: h2dp(5),
                  alignSelf: "center",
                }}
                titleStyle={styles.titleMainStyle}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default DriverRequestScreen;
