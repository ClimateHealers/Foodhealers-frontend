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

const DriverRequestScreen = ({ route }: any) => {
  // const { selectedImage } = route?.params;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loc, setLoc] = useState(false);
  // const [selectedImage1, setSelectedImage1] = useState(selectedImage);
  const [loading, setLoading] = useState(false);
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const navigation: any = useNavigation<string>();
  const dispatch = useDispatch();
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

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

  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.data?.isAuthenticated
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
                  <Text style={{ fontSize: 25, color: "#00693D" }}>
                    {localized.t("DRIVE")}
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
              <View
                style={{
                  height: h2dp(35),
                  width: h2dp(35),
                  borderRadius: h2dp(50),
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  marginTop: h2dp(3),
                  marginBottom: h2dp(3),
                }}
              >
                <TouchableOpacity>
                  {data?.user?.profilePhoto ? (
                    <View>
                      <Image
                        source={{ uri: data?.user?.profilePhoto }}
                        style={{ width: h2dp(35), height: h2dp(35) }}
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
              <Text style={{ fontSize: 36, color: "#00693D" }}>
                {/* {localized.t("DRIVE")} */}
                Hello, {data?.user?.name}
              </Text>
              <PrimaryButton
                title="See Pickup Requests"
                onPress={() => navigation.navigate("PickupDetailsScreen")}
                buttonStyle={{backgroundColor: "#00693D",
                color: "black",
                borderRadius: 5,
                width: w2dp(70),
                marginTop: h2dp(5),
                alignSelf: "center",}}
                titleStyle={[
                  styles.titleMainStyle,
                  {
                    color: "white",
                  },
                ]}
              />
              <PrimaryButton
                disabled={true}
                title={localized.t("HISTORY")}
                // onPress={() =>
                //   navigation.navigate("VolunteerDonationHistoryScreen")
                // }
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

export default DriverRequestScreen;
