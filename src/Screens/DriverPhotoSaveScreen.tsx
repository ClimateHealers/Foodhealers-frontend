import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { localized } from "../locales/localization";
import * as Permissions from "expo-permissions";

import { removeAuthData, updatePhoto } from "../redux/actions/authAction";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { logOut } from "../redux/reducers/authreducers";
import { styles } from "../Components/Styles";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import BurgerIcon from "../Components/BurgerIcon";
import PrimaryButton from "../Components/PrimaryButton";

const DriverPhotoSaveScreen = ({ route }: any) => {
  const { selectedImage } = route?.params;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loc, setLoc] = useState(false);
  const [selectedImage1, setSelectedImage1] = useState(selectedImage);
  const [loading, setLoading] = useState(false);
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();
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
        setSelectedImage1(singlePhoto);
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

  const formData = new FormData();
  formData.append("profilePhoto", {
    uri: selectedImage1,
    type: "image/jpeg",
    name: `${data?.user?.name}.jpg`,
  });

  const navigateToProfileScreen = async () => {
    try {
      setLoading(true);
      const response = await dispatch(updatePhoto(formData as any) as any);
      if (response?.payload?.success === true) {
        setLoading(false);
        Alert.alert(
          // `${localized.t("THAN_YOU_FOR_DONATION")}`,
          "Driver Profile created successfully",
          // `${localized.t("WH_HAVE_SUCCESSFULLY_ADDED_YOUR_DONATION")}`,
          "We have created your Driver Profile.",
          [
            {
              text: `${localized.t("OK")}`,
              onPress: () =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "DriverProfileScreen",
                        params: {
                          // itemTypeId: itemTypeId,
                          // title: title,
                          // latitude: latitude,
                          // longitude: longitude,
                        },
                      },
                    ],
                  })
                ),
            },
          ],
          { cancelable: false }
        );
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("firstfirstfirstfirst", error);
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
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
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
                  color="white"
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("DRIVE")}
                  </Text>
                </View>
                <BurgerIcon />
              </View>
              <View
                style={{
                  height: h2dp(35),
                  width: h2dp(35),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginTop: h2dp(10),
                  marginBottom: h2dp(3),
                }}
              >
                <TouchableOpacity onPress={openImagePickerAsync}>
                  <View>
                    <Image
                      source={{ uri: selectedImage1 }}
                      style={{ width: h2dp(35), height: h2dp(35) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <PrimaryButton
                title={localized.t("SAVE")}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
                onPress={navigateToProfileScreen}
              />
              <PrimaryButton
                title={localized.t("CHOOSE_FROM_CAMERA_ROLL")}
                onPress={openImagePickerAsync}
                buttonStyle={styles.buttonHistoryStyles}
                titleStyle={styles.titleMainStyle}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default DriverPhotoSaveScreen;
