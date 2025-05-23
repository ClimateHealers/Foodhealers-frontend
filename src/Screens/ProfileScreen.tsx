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
  Linking,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
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
import { Button, Divider } from "react-native-elements";
import { Badge } from "react-native-paper";
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
import { notfifications } from "../redux/actions/notificationAction";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] = useState<any>();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [image, setImage] = useState<any>();
  const navigation = useNavigation();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const expoPushToken = useSelector(
    (state: any) => state?.auth?.expoPushToken?.expoPushToken
  );

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    setData(response?.payload?.userDetails);
  };

  const fetchingNotificationsData = async () => {
    const response = await dispatch(notfifications({} as any) as any);
    const filterRead = response?.payload?.notifications?.filter(
      (event: any) => event?.is_unread === true
    );
    setNotificationData(filterRead?.length);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handlePressOutside = () => setMenuOpen(false);

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

  const openImagePickerAsync = async () => {
    const res = await MediaLibrary.requestPermissionsAsync();
    if (res?.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result?.canceled && result.assets?.[0]?.uri) {
        const singlePhoto = result.assets[0].uri;
        const formData = new FormData();
        setImage(singlePhoto);
        formData.append("profilePhoto", {
          uri: singlePhoto,
          type: "image/jpeg",
          name: `${data?.name}${new Date().getTime()}.jpg`,
        });

        try {
          setLoading(true);
          await dispatch(updatePhoto(formData as any) as any);
        } catch (error) {
          console.log("ERROR", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      Alert.alert(
        localized.t("MEDIA_LIBRARY_ACCESS"),
        localized.t("FOODHEALERS_APP_NEEDS_PHOTOLIBRARY"),
        [{ text: localized.t("OK") }],
        { cancelable: true }
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchingUserData();
      fetchingNotificationsData();
    }, [])
  );

  const appVersion = Constants?.manifest?.version;
  const profilePhotoSize = Math.min(width * 0.3, height * 0.2);

  const renderProfileImage = () => {
    if (image) {
      return (
        <Image
          source={{ uri: image }}
          style={{ width: profilePhotoSize, height: profilePhotoSize }}
        />
      );
    }

    if (
      !data?.profilePhoto ||
      data?.profilePhoto === "Profile Photo not available"
    ) {
      return (
        <View style={styles.placeholderContainer}>
          <AntDesign
            name="user"
            size={profilePhotoSize * 0.7}
            color="#B01D19"
          />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: data?.profilePhoto }}
        style={{ width: profilePhotoSize, height: profilePhotoSize }}
      />
    );
  };

  const renderMenuItem = (label: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Text>{localized.t(label)}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.mainContainer}>
          {menuOpen && (
            <View style={styles.menuContainer}>
              {renderMenuItem("HOME", () => navigation.replace("HomeScreen"))}
              {renderMenuItem("FIND_FOOD", () => {
                getLocation().then((res) => {
                  if (res) {
                    navigation.navigate("MapScreen", {
                      latitude: res?.latitude,
                      longitude: res?.longitude,
                    });
                  }
                });
                setMenuOpen(false);
              })}
              {isAuthenticated && (
                <>
                  {renderMenuItem("HISTORY", () => {
                    navigation.navigate("HistoryScreen");
                    setMenuOpen(false);
                  })}
                  {renderMenuItem("TEAM", () => {
                    navigation.navigate("TeamHomeScreen");
                    setMenuOpen(false);
                  })}
                </>
              )}
            </View>
          )}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("HomeScreen")}
            >
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{localized.t("ACCOUNT")}</Text>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("NotificationScreen")}
                style={styles.notificationIcon}
              >
                <Badge style={styles.badge}>{notificationData}</Badge>
                <Ionicons
                  name="notifications-outline"
                  color="white"
                  style={styles.notificationIcon}
                  size={30}
                />
              </TouchableOpacity>
              <MaterialCommunityIcons
                name="menu"
                size={40}
                color="white"
                onPress={toggleMenu}
              />
            </View>
          </View>

          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View style={styles.profileImageContainer}>
                <View
                  style={[
                    styles.profileImageWrapper,
                    { width: profilePhotoSize, height: profilePhotoSize },
                  ]}
                >
                  <TouchableOpacity onPress={openImagePickerAsync}>
                    {renderProfileImage()}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.editIconContainer}
                  onPress={() =>
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
                    })
                  }
                >
                  <AntDesign name="edit" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsSection}>
                {renderDetailRow("account", "NAME", data?.name)}
                <Divider style={styles.divider} />
                {renderDetailRow("email", "EMAIL", data?.email)}
                <Divider style={styles.divider} />
                {renderDetailRow("phone", "NUMBER", data?.phoneNumber || "N/A")}
                <Divider style={styles.divider} />
              </View>
            </View>
          </ScrollView>
          <PrimaryButton
            title={localized.t("LOGOUT")}
            onPress={logout}
            buttonStyle={styles.logoutButton}
            titleStyle={styles.logoutButtonText}
          />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => navigation.navigate("DeleteAccount")}
          >
            <Text style={styles.deleteButtonText}>
              {localized.t("DELETE_MY_ACCOUNT")}
            </Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.versionText}>
              {localized.t("APP_VERSION")} {appVersion}
            </Text>

            <View style={styles.supportRow}>
              <Text style={styles.supportText}>Contact us for support:</Text>
              <Text
                style={styles.supportLink}
                onPress={() =>
                  Linking.openURL("mailto:support@climatehealers.org")
                }
              >
                support@climatehealers.org
              </Text>
            </View>

            <Text
              style={styles.licenseLink}
              onPress={() => navigation.navigate("LicenseScreen")}
            >
              Open-Source Licences
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const renderDetailRow = (iconName: string, label: string, value: string) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons
      name={iconName}
      color="white"
      size={wp("6%")}
      style={styles.detailIcon}
    />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{localized.t(label)}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp("4%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    zIndex: 1,
    marginBottom: hp(1),
    marginTop: hp(2.8),
  },
  backButton: {
    width: wp("15%"),
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: wp("5%"),
    color: "white",
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    position: "relative",
    marginRight: wp("3%"),
  },
  badge: {
    position: "absolute",
    top: -5,
    right: 0,
    backgroundColor: "red",
  },
  menuContainer: {
    position: "absolute",
    right: wp("5%"),
    top: Platform.OS === "ios" ? hp("6%") : hp("5%"),
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    zIndex: 9999,
    elevation: 5,
    minWidth: wp("40%"),
  },
  menuItem: {
    padding: wp("3%"),
  },
  contentContainer: {
    flex: 1,
    borderRadius: 10,
    marginBottom: hp("2%"),
    paddingHorizontal: wp("3%"),
    top: hp(4),
  },
  profileSection: {
    alignItems: "center",
  },
  profileImageWrapper: {
    borderRadius: 100,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: hp(15),
    backgroundColor: "#FC5A56",
    borderRadius: 20,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },

  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
  },
  editButtonText: {
    color: "black",
    fontSize: wp("3.5%"),
    fontFamily: "OpenSans-Regular",
  },
  detailsSection: {
    width: "100%",
    marginTop: hp("2%"),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1%"),
  },
  detailIcon: {
    marginRight: wp("3%"),
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    ...systemWeights.regular,
    fontSize: wp("3.2%"),
    color: "white",
  },
  detailValue: {
    fontSize: wp("4%"),
    color: "white",
    marginTop: hp("0.5%"),
  },
  divider: {
    backgroundColor: "white",
    height: 1,
    marginVertical: hp("0.5%"),
  },
  logoutButton: {
    backgroundColor: "#FC5A56",
    borderRadius: wp(2),
    marginTop: hp(3),
    height: hp(6),
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: hp(2.2),
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#ff6e75",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    marginTop: hp("2%"),
    width: "100%",
    marginHorizontal: "auto",
    borderRadius: wp(2),
    height: hp(6),
  },
  deleteButtonText: {
    textAlign: "center",
    color: "#ff6e75",
    fontSize: hp(2.2),
  },
  footer: {
    alignItems: "center",
    marginTop: hp("4%"),
  },
  versionText: {
    fontSize: wp("3.2%"),
    color: "white",
    marginBottom: hp("1%"),
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  supportText: {
    fontSize: wp("3.2%"),
    color: "white",
  },
  supportLink: {
    fontSize: wp("3.2%"),
    color: "white",
    textDecorationLine: "underline",
    marginLeft: wp("1%"),
  },
  licenseLink: {
    fontSize: wp("3.5%"),
    color: "white",
    textDecorationLine: "underline",
    marginBottom: hp("3%"),
  },
});

export default ProfileScreen;
