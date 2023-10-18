import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
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
import { useDispatch, useSelector } from "react-redux";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { fetchVehicle } from "../redux/actions/addVehicle";

const DriverProfileScreen = ({ route }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loc, setLoc] = useState(false);
  // const [selectedImage, setSelectedImage] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const userDetails = useSelector((state: any) => state?.auth);
  const { data } = userDetails;
  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const fetchingVehiclesData = async () => {
    const response = await dispatch(fetchVehicle({} as any) as any);
    const data = response?.payload?.vehicleDetails[0];
    setVehicleDetails(data);
  };

  useEffect(() => {
    fetchingVehiclesData();
  }, []);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  // const takePhoto = async () => {
  //   const res = await Camera.getPhoto();
  //   if (res.granted) {
  //     const result = await ImagePicker.launchCamera({
  //       allowsMultipleSelection: true,
  //       selectionLimit: 1,
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: false,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       const multipleImages = result.assets.map((image) => image.uri);
  //       const singlePhoto = result.assets[0].uri;
  //       setSelectedImage(singlePhoto);
  //     }
  //   } else if (!res.granted) {
  //     Alert.alert(
  //       `${localized.t("MEDIA_LIBRARY_ACCESS")}`,
  //       `${localized.t("FOODHEALERS_APP_NEEDS_PHOTOLIBRARY.")}`,
  //       [
  //         {
  //           text: `${localized.t("OK")}`,
  //         },
  //       ],
  //       { cancelable: true }
  //     );
  //   }
  // };

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
        navigation.navigate("DriverPhotoSaveScreen", {
          selectedImage: singlePhoto,
        });
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

  const appLoader = (loader: any) => {
    return (
      <View style={styles.centeredView}>
        <Modal visible={loader} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={"large"} color="white" />
            </View>
          </View>
        </Modal>
      </View>
    );
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
                  <Text style={styles.itemText}>
                    {/* {localized.t("POST_AN_EVENT")} */}
                    {/* {localized.t("DRIVE")} */}
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
              <Text style={{ fontSize: 36, color: "#00693D" }}>
                {localized.t("DRIVE")}
              </Text>
              <View
                style={{
                  height: h2dp(20),
                  width: h2dp(20),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginTop: h2dp(2),
                }}
              >
                <TouchableOpacity onPress={openImagePickerAsync}>
                  {data?.user?.profilePhoto ? (
                    <View>
                      <Image
                        source={{ uri: data?.user?.profilePhoto }}
                        style={{ width: h2dp(20), height: h2dp(20) }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingVertical: h2dp(2),
                        paddingHorizontal: w2dp(5),
                        justifyContent: "center",
                        marginBottom: h2dp(1),
                      }}
                    >
                      <AntDesign name="user" size={150} color="#B01D19" />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={{ fontSize: 36, color: "#00693D" }}>
                  {data?.user?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginHorizontal: w2dp(10),
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "500", marginTop: h2dp(2) }}
              >
                {data?.user?.name}
              </Text>
              <Text style={{ fontSize: 24, marginTop: h2dp(2) }}>
                {data?.user?.email}
              </Text>
              <Text style={{ fontSize: 24, marginTop: h2dp(2) }}>
                {data?.user?.address?.fullAddress}
              </Text>
              <Text style={{ fontSize: 24, marginTop: h2dp(2) }}>
                {data?.user?.phoneNumber}
              </Text>
              <Text style={{ fontSize: 24, marginTop: h2dp(2) }}>
                {vehicleDetails?.make} {vehicleDetails?.model},{" "}
                {vehicleDetails?.vehicleColour}
              </Text>
              <Text style={{ fontSize: 24, marginTop: h2dp(2) }}>
                {vehicleDetails?.plateNumber}
              </Text>
            </View>
            <PrimaryButton
              title={localized.t("ACCEPT_RIDES")}
              onPress={() => navigation.navigate("PickupDetailsScreen")}
              buttonStyle={[
                styles.nextButtonStyles,
                {
                  backgroundColor: "#00693D",
                },
              ]}
              titleStyle={[
                styles.titleMainStyle,
                {
                  color: "white",
                },
              ]}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default DriverProfileScreen;
