import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  Alert,
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
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import PrimaryButton from "../Components/PrimaryButton";

const UploadPhotosScreen = ({ route }: any) => {
  const { eventFormData } = route.params;
  const [menuClose, setMenuOpen] = useState(false);
  const [loc, setLoc] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | []>([]);

  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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

        navigation.navigate("EventPhotosScreen", {
          eventFormData: eventFormData,
          eventPhotos: multipleImages,
          singlePhoto: singlePhoto,
        });
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

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
s        style={styles.background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              marginHorizontal: w2dp(4),
            }}
          >
            <FoodhealersHeader />
            <View style={styles.root}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack();
                  handlePressOutside();
                }}
              />
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  {localized.t("POST_AN_EVENT")}
                </Text>
              </View>
              <BurgerIcon
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
            </View>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: w2dp(2),
                alignItems: "center",
                padding: h2dp(4),
                width: w2dp(90),
                height: h2dp(30),
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#FC5A56",
                  paddingVertical: h2dp(1.5),
                  paddingHorizontal: w2dp(5),
                  borderRadius: 10,
                }}
                onPress={openImagePickerAsync}
              >
                <AntDesign name="upload" size={24} color="white" />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: h2dp(2.0),
                  marginTop: h2dp(2),
                }}
              >
                {localized.t("UPLOAD_EVENT_PHOTO")}
              </Text>
            </View>
          </ScrollView>

          <View style={{ paddingBottom: h2dp(2) }}>
            <PrimaryButton
              title={localized.t("BACK")}
              buttonStyle={styles.buttonStyles}
              titleStyle={styles.titleStyle}
              onPress={() => {
                navigation.goBack();
                handlePressOutside();
              }}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default UploadPhotosScreen;
