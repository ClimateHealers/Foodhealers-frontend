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

import { SafeAreaView } from "react-native-safe-area-context";
import { localized } from "../locales/localization";
import * as Permissions from "expo-permissions";

import { removeAuthData } from "../redux/actions/authAction";
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

const UploadPhotosScreen = ({ route }: any) => {
  const { eventFormData } = route.params;

  console.log("checking data from post event form", eventFormData);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loc, setLoc] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | []>([]);

  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
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
  const logout = async (item: any) => {
    // persistor.purge()
    await dispatch(logOut({}) as any);
    await removeAuthData();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
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
        console.log("checking image from library", result.assets);
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
        `${localized.t("Media Library Access")}`,
        `${localized.t("FoodHealers app needs PhotoLibrary permission to let you update your profile picture, and create/modify events with appropriate images for community.You can enable it anytime from settings.")}`,
        [
          {
            text: "Ok",
            // onPress: () => {
            //   Platform?.OS === "ios"
            //     ? Linking.openURL("app-settings:root=Photos")
            //     : Linking.sendIntent(
            //         "android.settings.LOCATION_SOURCE_SETTINGS"
            //       );
            // },
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
    <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
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
                  <Text style={styles.itemText}>{localized.t("Post an Event")}</Text>
                </View>
                <BurgerIcon />
              </View>
              <View
                style={[
                  styles.card,
                  {
                    height: h2dp(40),
                    borderRadius: h2dp(1),
                    alignItems: "center",
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FC5A56",
                    paddingVertical: h2dp(1),
                    paddingHorizontal: w2dp(5),
                    marginBottom: h2dp(1),
                    marginTop: h2dp(12),
                  }}
                  onPress={openImagePickerAsync}
                >
                  <AntDesign name="upload" size={24} color="black" />
                </TouchableOpacity>

                <Text style={{ fontSize: 20, marginTop: 10 }}>
                  {localized.t("Upload event photo")}
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 40,
                      textDecorationLine: "underline",
                    }}
                  >
                    {localized.t("Back")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default UploadPhotosScreen;
