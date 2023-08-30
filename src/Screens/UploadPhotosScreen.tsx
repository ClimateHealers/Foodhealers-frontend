import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard, Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { localized } from "../locales/localization";
import * as Permissions from "expo-permissions";

import { removeAuthData } from "../redux/actions/authAction";
import {
  heightPercentageToDP as h2dp, widthPercentageToDP as w2dp
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import { logOut } from "../redux/reducers/authreducers";

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
      if(res){
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
    await removeAuthData()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  const openImagePickerAsync = async () => {
    const res = await MediaLibrary.requestPermissionsAsync();
    console.log("jfbvdjkbdbfkjd", res.granted)
    if (res.granted) {
      console.log("sdvskdvjnsdkvjnkdbn",res.granted);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 1,
      });
  
      if (!result.canceled) {
        console.log("checking image from library", result.assets)
        const multipleImages = result.assets.map((image) => image.uri);
        const singlePhoto = result.assets[0].uri;
        
  
  
        navigation.navigate("EventPhotosScreen", {
          eventFormData: eventFormData,
          eventPhotos: multipleImages,
          singlePhoto :singlePhoto
        });
      }
    }else if(!res.granted){      
      Alert.alert(
        "Media Library Access",
        "FoodHealers app needs PhotoLibrary permission to let you update your profile picture, and create/modify events with appropriate images for community.You can enable it anytime from settings.",
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
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView>
        {menuOpen && (
          <View
            style={{
              position: "absolute",
              right: w2dp("16"),
              top: Platform.OS === "ios" ? h2dp(13.2) : h2dp(9),
              backgroundColor: "white",
              borderColor: "black",
              borderWidth:0.2,
              borderRadius: 5,
              width: w2dp("32"),
              zIndex: 9999,
            }}
          >
            <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
              <Text
                style={{
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "300",
                  lineHeight: 27.24,
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => findFoodMenuItemPress("Find Food")}
            >
              <Text
                style={{
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "300",
                  lineHeight: 27.24,
                }}
              >
                Find Food
              </Text>
            </TouchableOpacity>
            {isAuthenticated && (
              <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "300",
                    lineHeight: 27.24,
                  }}
                >
                  Account
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.itemText}>{"Post an Event"}</Text>
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

        <View style={styles.card}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FC5A56",
              paddingVertical: 10,
              paddingHorizontal: 35,
              marginBottom: 10,
            }}
            onPress={openImagePickerAsync}
          >
            <AntDesign name="upload" size={24} color="black" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, marginTop: 10 }}>
            Upload event photo
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text
              style={{
                fontSize: 20,
                marginTop: 40,
                textDecorationLine: "underline",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  item: {
    marginRight: 35,
    height: 100,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    marginRight: 20,
  },

  card: {
    backgroundColor: "white",
    width: "90%",
    height: "65%",
    marginLeft: 20,
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "black",
    borderRadius: 5,
    width: 190,
    marginTop: 20,
    marginLeft: 85,
  },
  titleStyle: {
    color: "white",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  cardTextConainer: {
    marginTop: 30,
  },
  cardText: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "OpenSans-Light",
  },
  boldText: {
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default UploadPhotosScreen;
