import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
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

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { fetchVehicle } from "../redux/actions/addVehicle";
import { fetchUser, updatePhoto } from "../redux/actions/authAction";
import BurgerIcon from "../Components/BurgerIcon";

const DriverRequestScreen = ({ route }: any) => {
  const [menuClose, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<any>();
  const [data, setData] = useState<any>();
  const date = new Date().getTime();
  const [image, setImage] = useState<any>();
  const navigation: any = useNavigation<string>();
  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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
      const { routes } = navigation.getState();
      const filteredRoutes = routes.filter(
        (route: any) =>
          route.name !== "UpdateVehicleScreen" &&
          route.name !== "AddVehicleScreen"
      );

      navigation.reset({
        index: filteredRoutes.length - 2,
        routes: filteredRoutes,
      });
    }, [])
  );

  const dispatch = useDispatch();

  const fetchingVehiclesData = async () => {
    const response = await dispatch(fetchVehicle({} as any) as any);

    const indexLength = response?.payload?.vehicleDetails?.length;
    const data = response?.payload?.vehicleDetails[indexLength - 1];
    setVehicleDetails(data);
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
        `${localized.t("FOODHEALERS_APP_NEEDS_PHOTOLIBRARY")}`,
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
    setMenuOpen(!menuClose);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.containerVolunteer}>
            <FoodhealersHeader />
            <View style={styles.root}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => {
                  navigation.navigate("TeamHomeScreen"), handlePressOutside();
                }}
              />
              <View style={styles.item}>
                <Text style={styles.itemText}> {localized.t("DRIVE")}</Text>
              </View>
              <BurgerIcon
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <View
                style={{
                  height: h2dp(30),
                  width: h2dp(30),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginBottom: h2dp(3),
                  borderRightColor: "red",
                  marginHorizontal: "auto",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handlePressOutside(), openImagePickerAsync;
                  }}
                >
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
                        style={{ width: h2dp(30), height: h2dp(30) }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.itemText,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                {localized.t("HELLO")}, {data?.name}
              </Text>
              <View style={styles.vehicledetailsCard}>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: "black",
                      textAlign: "center",
                    },
                  ]}
                >
                  {vehicleDetails?.make} {vehicleDetails?.model}
                </Text>

                <Text
                  style={{
                    fontSize: h2dp(1.8),
                    color: "#555",
                    textAlign: "center",
                  }}
                >
                  {vehicleDetails?.vehicleColour} |{" "}
                  {vehicleDetails?.plateNumber}
                </Text>

                <PrimaryButton
                  title={localized.t("EDIT_VEHICLE_DETAILS")}
                  onPress={() => {
                    handlePressOutside(),
                      navigation.navigate("UpdateVehicleScreen", {
                        id: vehicleDetails?.id,
                        make: vehicleDetails?.make,
                        model: vehicleDetails?.model,
                        vehicleColour: vehicleDetails.vehicleColour,
                        plateNumber: vehicleDetails?.plateNumber,
                      });
                  }}
                  buttonStyle={[
                    styles.buttonStyles,
                    {
                      height: h2dp(5),
                    },
                  ]}
                  titleStyle={styles.titleStyle}
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ paddingBottom: h2dp(2) }}>
            <PrimaryButton
              title={localized.t("SEE_PICKUP_REQUESTS")}
              onPress={() => {
                handlePressOutside(),
                  navigation.navigate("PickupDetailsScreen", {
                    itemTypeId: 4,
                  });
              }}
              buttonStyle={styles.buttonStyles}
              titleStyle={styles.titleStyle}
            />
            <PrimaryButton
              title={localized.t("HISTORY")}
              onPress={() => {
                handlePressOutside(),
                  navigation.navigate("PickupHistoryScreen", {
                    itemTypeId: 4,
                  });
              }}
              buttonStyle={[
                styles.buttonStyles,
                {
                  backgroundColor: "gray",
                },
              ]}
              titleStyle={styles.titleStyle}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default DriverRequestScreen;
