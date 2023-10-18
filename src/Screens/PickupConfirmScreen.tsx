import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Keyboard,
  Linking,
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

const PickupConfirmScreen = ({ route }: any) => {
  const {
    pickAddress,
    pickupTiming,
    picklat,
    picklng,
    droplat,
    droplng,
    dropTiming,
    dropAddress
  } = route?.params;
  console.log("object", route)
  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const navigationHandler = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${picklat},${picklng}`;
    Linking.openURL(url);
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
              <Text
                style={{
                  fontSize: 26,
                  marginTop: h2dp(3),
                  alignSelf: "center",
                }}
              >
                {/* {localized.t("A_PHOTO_OF_YOU")} */}
                {localized.t("PICKUP_CONFIRMED")}
              </Text>
              <View style={{ height: h2dp(40), marginTop: h2dp(3) }}>
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
                        marginTop: h2dp(3),
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
                        {localized.t("PICKUP")}
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
                        {localized.t("DROPOFF")}
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
                    <PrimaryButton
                      title={`${localized.t("GET_DIRECTIONS")}`}
                      onPress={navigationHandler}
                      buttonStyle={[
                        styles.buttonStyles,
                        {
                          marginBottom: h2dp(2),
                        },
                      ]}
                      titleStyle={styles.titleStyle}
                    />
                  </ScrollView>
                </View>
              </View>
              <PrimaryButton
                title={localized.t("ADD_MORE")}
                onPress={() => navigation.navigate("PickupDetailsScreen")}
                buttonStyle={styles.buttonStyles}
                titleStyle={styles.titleStyle}
              />
              <PrimaryButton
                title={localized.t("CANCEL")}
                onPress={() => navigation.navigate("PickupDetailsScreen")}
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

export default PickupConfirmScreen;
