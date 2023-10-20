import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
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
import { useSelector } from "react-redux";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";

const DriverRequestScreen = ({ route }: any) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const userDetails = useSelector((state: any) => state.auth);
  const { data } = userDetails;
  const navigation: any = useNavigation<string>();
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
                  borderWidth: 2,
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
                      <AntDesign name="user" size={300} color="#B01D19" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 36, color: "#00693D" }}>
                Hello, {data?.user?.name}
              </Text>
              <PrimaryButton
                title="See Pickup Requests"
                onPress={() =>
                  navigation.navigate("PickupDetailsScreen", {
                    itemTypeId: 4,
                  })
                }
                buttonStyle={{
                  backgroundColor: "#00693D",
                  color: "black",
                  borderRadius: 5,
                  width: w2dp(70),
                  marginTop: h2dp(5),
                  alignSelf: "center",
                }}
                titleStyle={[
                  styles.titleMainStyle,
                  {
                    color: "white",
                  },
                ]}
              />
              <PrimaryButton
                title={localized.t("HISTORY")}
                onPress={() =>
                  navigation.navigate("PickupHistoryScreen", {
                    itemTypeId: 4,
                  })
                }
                buttonStyle={{backgroundColor: "white",
                color: "black",
                borderRadius: 5,
                borderColor: "black",
                borderWidth: 1,
                width: w2dp(70),
                marginTop: h2dp(5),
                alignSelf: "center",}}
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
