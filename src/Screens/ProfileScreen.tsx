import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/core";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { Divider } from "react-native-elements";
import { Badge } from "react-native-paper";
import {
  heightPercentageToDP as hp2dp,
  widthPercentageToDP as wp2dp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { iOSColors, systemWeights } from "react-native-typography";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../Components/getCurrentLocation";
import PrimaryButton from "../Components/PrimaryButton";
import {
  fetchUser,
  removeAuthData,
  updatePhoto,
} from "../redux/actions/authAction";
import { logOut } from "../redux/reducers/authreducers";
import { localized } from "../locales/localization";

const ProfileScreen = () => {
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  let date = new Date().getTime();
  const [image, setImage] = useState<any>();
  const navigation: any = useNavigation();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };

  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const appVersion = Constants?.manifest?.version;

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
  const logout = async () => {
    await dispatch(logOut({} as any) as any);
    await removeAuthData();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchingUserData();
    }, [])
  );

  const navigationHandler = () => {
    navigation.navigate("DeleteAccount");
  };

  const openImagePickerAsync = async () => {
    const res = await MediaLibrary.requestPermissionsAsync();
    if (res?.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result?.canceled) {
        const multipleImages = result?.assets?.map((image) => image.uri);
        const singlePhoto = result?.assets[0].uri;
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

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.mainContainer}>
        {menuOpen && (
          <View
            style={{
              position: "absolute",
              right: wp2dp("12"),
              top: Platform.OS === "ios" ? hp2dp(8) : hp2dp(6),
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 0.5,
              borderRadius: 5,
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
                {localized.t("HOME")}
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
                {localized.t("FIND_FOOD")}
              </Text>
            </TouchableOpacity>
            {isAuthenticated && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("HistoryScreen");
                    setMenuOpen(false);
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    {localized.t("HISTORY")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TeamHomeScreen");
                    setMenuOpen(false);
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "300",
                      lineHeight: 27.24,
                    }}
                  >
                    {localized.t("TEAM")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <View style={styles.row}>
          <View
            style={{ height: 100, justifyContent: "center", width: wp2dp(25) }}
          ></View>
          <View style={{ height: 100, justifyContent: "center" }}>
            <Text style={styles.itemText}>{localized.t("ACCOUNT")}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NotificationScreen");
              }}
              style={styles.circleAvatar}
            >
              <Badge style={styles.notificatioAvatarLogo}>0</Badge>

              <Ionicons
                name="md-notifications-outline"
                style={styles.avatarLogo}
                size={28}
              />
            </TouchableOpacity>
            <View style={styles.item}>
              <MaterialCommunityIcons
                name="menu"
                size={40}
                color="white"
                onPress={toggleMenu}
              />
            </View>
          </View>
        </View>
        <ScrollView style={styles.ScrollView}>
          <View>
            <View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View></View>
                <View
                  style={{
                    height: hp2dp(20),
                    width: hp2dp(20),
                    borderRadius: hp2dp(50),
                    alignItems: "center",
                    backgroundColor: "white",
                    overflow: "hidden",
                    marginTop: hp2dp(2),
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity onPress={openImagePickerAsync}>
                    {image ? (
                      <View>
                        <Image
                          source={{ uri: image }}
                          style={{ width: hp2dp(20), height: hp2dp(20) }}
                        />
                      </View>
                    ) : (
                      <View>
                        {!data?.profilePhoto ||
                        data?.profilePhoto === "Profile Photo not available" ? (
                          <View
                            style={{
                              paddingVertical: hp2dp(2),
                              justifyContent: "center",
                              marginBottom: hp2dp(1),
                              position: "relative",
                            }}
                          >
                            <AntDesign name="user" size={150} color="#B01D19" />
                          </View>
                        ) : (
                          <View>
                            <Image
                              source={{ uri: data?.profilePhoto }}
                              style={{ width: hp2dp(20), height: hp2dp(20) }}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
                <PrimaryButton
                  title={localized.t("EDIT")}
                  onPress={() => {
                    navigation.navigate("UpdateProfileScreen", {
                      name: data?.name,
                      phoneNumber: data?.phoneNumber,
                      email: data?.email,
                      lat: data?.address?.lat,
                      long: data?.address?.lng,
                      volunteerFullAddress: data?.address?.fullAddress,
                      city: data?.address?.city,
                      state: data?.address?.state,
                      zipCode: data?.address?.postalCode,
                    });
                  }}
                  buttonStyle={{
                    backgroundColor: "#D1D1D6",
                    color: "white",
                    borderRadius: 5,
                    right: 0,
                    float: "right",
                    paddingHorizontal: wp2dp(6),
                    marginLeft: wp2dp(2),
                  }}
                  titleStyle={{
                    color: "black",
                    fontSize: 18,
                    lineHeight: 20,
                    fontFamily: "OpenSans-Regular",
                  }}
                />
              </View>
              <View style={styles.rowItem}>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <MaterialCommunityIcons
                    color="white"
                    size={24}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      marginRight: 5,
                    }}
                    name="account"
                  />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={styles.profileDetailsText3}>
                      {localized.t("NAME")}
                    </Text>
                    <Text style={[styles.profileDetailsText2]}>
                      {data?.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: wp2dp("28%"),
                  }}
                ></View>
              </View>
              <Divider
                style={{
                  backgroundColor: "white",
                  height: 1,
                  padding: 0.8,
                  marginTop: hp2dp("0.5%"),
                }}
              />
              <View style={styles.rowItem}>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <MaterialIcon
                    color="white"
                    size={24}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      marginRight: 5,
                    }}
                    name="email"
                  />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={styles.profileDetailsText3}>
                      {localized.t("EMAIL")}
                    </Text>
                    <Text style={[styles.profileDetailsText2]}>
                      {data?.email}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: wp2dp("28%"),
                  }}
                ></View>
              </View>
              <Divider
                style={{
                  backgroundColor: "white",
                  height: 1,
                  padding: 0.8,
                  marginTop: hp2dp("0.5%"),
                }}
              />
              <View style={styles.rowItem}>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <MaterialCommunityIcons
                    color="white"
                    size={24}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      marginRight: 5,
                    }}
                    name="phone"
                  />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={styles.profileDetailsText3}>
                      {localized.t("NUMBER")}
                    </Text>
                    <Text style={[styles.profileDetailsText2]}>
                      {data?.phoneNumber}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: wp2dp("28%"),
                  }}
                ></View>
              </View>
              <Divider
                style={{
                  backgroundColor: "white",
                  height: 1,
                  padding: 0.8,
                  marginTop: hp2dp("0.5%"),
                }}
              />
            </View>

            <View style={[styles.logout, { alignSelf: "center" }]}>
              <PrimaryButton
                title={localized.t("LOGOUT")}
                onPress={logout}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
              />
            </View>
            <View style={[styles.deleteProfile, { alignSelf: "center" }]}>
              <TouchableOpacity
                style={styles.deleteProfileTextContainer}
                onPress={() => navigation.navigate("DeleteAccount")}
              >
                <Text style={styles.deleteProfileText}>
                  {localized.t("DELETE_MY_ACCOUNT")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.appVersion}>
              {localized.t("APP_VERSION")} {appVersion}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  item: {
    marginRight: wp2dp(5),
    height: 100,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginHorizontal: wp2dp("4.5%"),
  },
  EditContainer: {
    backgroundColor: "#0ACF83",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  rowItem: {
    borderColor: "black",
    marginTop: hp2dp(5),
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  ScrollView: {
    marginHorizontal: 5,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  profileDetails: {
    marginBottom: 50,
    backgroundColor: "blue",
  },
  profileName: {
    paddingTop: 10,
  },
  profileDetailsText: {
    paddingVertical: 8,
    paddingLeft: 5,
  },
  profileDetailsText2: {
    paddingLeft: 5,
    marginTop: -2,
    fontSize: 20,
    color: "white",
  },
  profileDetailsText3: {
    ...systemWeights.regular,
    fontSize: 15,
    paddingLeft: 5,
    color: "white",
  },
  iconandText: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  profileDetailsText1: {
    paddingTop: 8,
    fontSize: 25,
    textAlign: "center",
    color: "white",
  },
  appVersion: {
    paddingTop: hp2dp(8),
    fontSize: 15,
    textAlign: "center",
    color: "white",
    marginBottom: hp2dp(3),
  },
  editProfileRoot: {
    marginTop: 10,
    width: wp2dp("35%"),
    marginVertical: 5,
  },
  editProfile: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#0198ff",
    paddingVertical: 4,
  },
  buttonStyles: {
    backgroundColor: "#FC5A56",
    color: "white",
    borderRadius: 5,
    paddingHorizontal: wp2dp(5),
    marginTop: hp2dp("1.5"),
  },
  titleStyle: {
    color: "white",
    fontSize: 26,
    lineHeight: 35,
    fontFamily: "OpenSans-Regular",
  },
  verifyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#0198ff",
    paddingVertical: 2,
  },
  UpdateProfileIcon: {
    paddingRight: 5,
    color: "#0198ff",
  },
  UpdateprofileText: {},
  blue: {
    color: iOSColors.blue,
  },
  cardText: {
    marginTop: 3,
    ...systemWeights.semibold,
    color: "black",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    height: hp2dp("23%"),
    width: wp2dp("50%"),
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  logout: {
    marginTop: hp2dp(5),
  },
  deleteProfile: {
    marginTop: hp2dp(5),
  },
  deleteProfileTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  deleteProfileText: {
    ...systemWeights.regular,
    paddingRight: 5,
    color: "red",
    fontSize: 12,
  },
  circleAvatar: {
    borderRadius: 50,
    width: Platform?.OS == "ios" ? wp2dp("17%") : wp2dp("10.5%"),
    height: hp2dp("5%"),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  notificatioAvatarLogo: {
    position: "absolute",
    top: -4,
    right: 11,
    zIndex: 1000,
  },
  avatarLogo: {
    color: "white",
  },
});

export default ProfileScreen;
