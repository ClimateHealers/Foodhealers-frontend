import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
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

import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { updatePhoto } from "../redux/actions/authAction";

const DriverPhotoSaveScreen = ({ route }: any) => {
  const { selectedImage, fromCameraRoll } = route?.params;
  const [selectedImage1, setSelectedImage1] = useState(selectedImage);
  const [loading, setLoading] = useState(false);
  const date = new Date().getTime();
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();
  const handlePressOutside = () => {
    Keyboard.dismiss();
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
        setSelectedImage1(singlePhoto);
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

  const formData = new FormData();
  formData.append("profilePhoto", {
    uri: selectedImage1,
    type: "image/jpeg",
    name: `${data?.user?.name}${date}.jpg`,
  });

  const navigateToProfileScreen = async () => {
    try {
      setLoading(true);
      const response = await dispatch(updatePhoto(formData as any) as any);
      if (response?.payload?.success === true) {
        setLoading(false);
        Alert.alert(
          `${localized.t("DRIVER_PROFILE_CREATED_SUCCESSFULLY")}`,
          `${localized.t("WE_HAVE_CREATED_YOUR_DRIVER_PROFILE")}`,
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
        console.log("ERROR");
      }
    } catch (error) {
      console.log("ERROR", error);
    }
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
                  onPress={() => navigation.navigate("DriverProfilePhoto")}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{localized.t("DRIVE")}</Text>
                </View>
                <BurgerIcon />
              </View>
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>
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
                title={fromCameraRoll ? localized.t("TAKE_PHOTO") : localized.t("RETAKE")}
                buttonStyle={styles.buttonHistoryStyles}
                titleStyle={styles.titleMainStyle}
                onPress={() => navigation.navigate("TakePictureScreen")}
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
