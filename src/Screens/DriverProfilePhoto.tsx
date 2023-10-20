import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import { Camera, CameraType } from "expo-camera";
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
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";

const DriverProfilePhoto = ({ route }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loc, setLoc] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const userDetails = useSelector((state: any) => state.auth);
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
        console.log("kjfnsjknvkdnvd", singlePhoto)
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
                  <Text style={styles.itemText}>{localized.t("DRIVE")}</Text>
                </View>
                <BurgerIcon />
              </View>
              <View
                style={{
                  height: h2dp(20),
                  width: h2dp(20),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginTop: h2dp(10),
                }}
              >
                <TouchableOpacity onPress={openImagePickerAsync}>
                  {selectedImage ? (
                    <View>
                      <Image
                        source={{ uri: selectedImage }}
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
              </View>
              <Text style={{ fontSize: 26, marginTop: h2dp(3) }}>
                {localized.t("A_PHOTO_OF_YOU")}
              </Text>
              <PrimaryButton
                title={localized.t("TAKE_PHOTO")}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
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

export default DriverProfilePhoto;
