import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { useDispatch } from "react-redux";
import { acceptPickup } from "../redux/actions/acceptPickupAction";

const PickupSelectedDetailsScreen = ({ route }: any) => {
  const {
    pickAddress,
    pickupTiming,
    picklat,
    dropAddress,
    picklng,
    droplat,
    droplng,
    dropTiming,
    pickupId,
    active,
    fullfilled,
    pickedup,
    delivered,
  } = route?.params;
  const [menuClose, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
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
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <Text
                style={{
                  fontSize: 26,
                  marginTop: h2dp(3),
                  alignSelf: "center",
                }}
              >
                {localized.t("ACCEPT_A_PICKUP_TODAY")}
              </Text>
              <View style={{ height: h2dp(40), marginTop: h2dp(7) }}>
                <View
                  style={[
                    styles.cardContainer,
                    {
                      paddingBottom: h2dp(3),
                    },
                  ]}
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                      style={{
                        marginLeft: w2dp(3),
                        fontSize: 16,
                        lineHeight: 30,
                        fontWeight: "500",
                        paddingTop: h2dp(0.5),
                        alignSelf: "center",
                        marginVertical: h2dp(1),
                      }}
                    >
                      {pickupTiming}
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: w2dp(3),
                          fontSize: 16,
                          lineHeight: 30,
                          fontWeight: "500",
                          paddingTop: h2dp(0.5),
                        }}
                      >
                        {localized.t("PICKUP")} :
                      </Text>

                      <ScrollView showsVerticalScrollIndicator={false}>
                        <Text
                          style={{
                            marginLeft: w2dp(3),
                            fontSize: 16,
                            lineHeight: 30,
                            paddingTop: h2dp(0.5),
                            marginRight: w2dp(3),
                          }}
                        >
                          {pickAddress}
                        </Text>
                      </ScrollView>
                    </View>
                    <Text
                      style={{
                        marginLeft: w2dp(3),
                        fontSize: 16,
                        lineHeight: 30,
                        fontWeight: "500",
                        paddingTop: h2dp(0.5),
                        alignSelf: "center",
                        marginVertical: h2dp(1),
                      }}
                    >
                      {dropTiming}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: w2dp(3),
                          fontSize: 16,
                          lineHeight: 30,
                          fontWeight: "500",
                          paddingTop: h2dp(0.5),
                        }}
                      >
                        {localized.t("DROPOFF")} :
                      </Text>

                      <ScrollView showsVerticalScrollIndicator={false}>
                        <Text
                          style={{
                            marginLeft: w2dp(3),
                            fontSize: 16,
                            lineHeight: 30,
                            paddingTop: h2dp(0.5),
                            marginRight: w2dp(3),
                          }}
                        >
                          {dropAddress}
                        </Text>
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              </View>
              <PrimaryButton
                title={localized.t("ACCEPT")}
                onPress={async () => {
                  setLoading(true);
                  try {
                    setResponse({
                      loading: true,
                      message: "",
                      error: false,
                    });
                    const data = {
                      requestId: pickupId,
                    };
                    const res = await dispatch(
                      acceptPickup(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: "PickUp Accepted",
                        error: false,
                      });
                      setLoading(false);
                      Alert.alert(
                        // `${localized.t("VEHICLE_ADDED_SUCCESSFULLY")}`,
                        "Pickup Accepted",
                        // `${localized.t("YOUR_VEHICLE_HAS_BEEN_ADDED_SUCCESSFULLY")}`,
                        "You have accepted the pickup request.",
                        [
                          {
                            text: "OK",
                            onPress: () =>
                              navigation.navigate("PickupConfirmScreen", {
                                pickAddress: pickAddress,
                                pickupTiming: pickupTiming,
                                picklat: picklat,
                                picklng: picklng,
                                droplat: droplat,
                                droplng: droplng,
                                dropTiming: dropTiming,
                                dropAddress: dropAddress,
                                pickupId: pickupId,
                                active: active,
                                fullfilled: fullfilled,
                                pickedup: pickedup,
                                delivered: delivered,
                              }),
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                  } catch (err: any) {
                    setLoading(false);
                    setResponse({
                      loading: false,
                      message: err?.message,
                      error: true,
                    });
                  }
                }}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default PickupSelectedDetailsScreen;
