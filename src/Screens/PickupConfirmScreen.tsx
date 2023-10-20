import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { Formik } from "formik";
import { otpGenerate } from "../redux/actions/optGenerateAction";
import { TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updatePickupRequest } from "../redux/actions/acceptPickupAction";

const PickupConfirmScreen = ({ route }: any) => {
  const {
    pickAddress,
    pickupTiming,
    picklat,
    picklng,
    droplat,
    droplng,
    pickupId,
    dropTiming,
    dropAddress,
    active,
    fullfilled,
    pickedup,
    delivered,
  } = route?.params;
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [otpType, setOtpType] = useState<any>("pickup");

  const dispatch = useDispatch();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!pickedup) {
      setOtpType("pickup");
    } else if (pickedup && !delivered) {
      setOtpType("drop");
    }
  }, []);

  const pickNavigationHandler = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${picklat},${picklng}`;
    Linking.openURL(url);
  };

  const dropNavigationHandler = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${droplat},${droplng}`;
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
                  alignSelf: "center",
                }}
              >
                {!fullfilled
                  ? `${localized.t("PICKUP_CONFIRMED")}`
                  : "Pickup Completed"}
              </Text>
              <View style={{ marginTop: h2dp(3) }}>
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

                    {!fullfilled ? (
                      <PrimaryButton
                        title={`${localized.t("GET_DIRECTIONS")}`}
                        onPress={pickNavigationHandler}
                        buttonStyle={[
                          styles.buttonStyles,
                          {
                            marginBottom: h2dp(2),
                          },
                        ]}
                        titleStyle={styles.titleStyle}
                      />
                    ) : null}

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

                    {!fullfilled ? (
                      <PrimaryButton
                        title={`${localized.t("GET_DIRECTIONS")}`}
                        onPress={dropNavigationHandler}
                        buttonStyle={[
                          styles.buttonStyles,
                          {
                            marginBottom: h2dp(2),
                          },
                        ]}
                        titleStyle={styles.titleStyle}
                      />
                    ) : null}
                  </ScrollView>
                </View>
              </View>
              {!otp ? (
                <View>
                  {active ? (
                    <View>
                      <PrimaryButton
                        title={localized.t("ADD_MORE")}
                        onPress={() =>
                          navigation.navigate("PickupDetailsScreen", {
                            itemTypeId: 4,
                          })
                        }
                        buttonStyle={styles.buttonStyles}
                        titleStyle={styles.titleStyle}
                      />
                      <PrimaryButton
                        title={localized.t("CANCEL")}
                        onPress={() =>
                          navigation.navigate("PickupDetailsScreen", {
                            itemTypeId: 4,
                          })
                        }
                        buttonStyle={styles.buttonHistoryStyles}
                        titleStyle={styles.titleMainStyle}
                      />
                    </View>
                  ) : (
                    <PrimaryButton
                      title={localized.t("GENERATE_OTP")}
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
                            otpType: otpType,
                          };
                          const res = await dispatch(
                            otpGenerate(data as any) as any
                          );
                          if (res?.payload?.success == true) {
                            setLoading(false);
                            setResponse({
                              loading: false,
                              message: "PickUp Delivered",
                              error: false,
                            });
                            setLoading(false);
                            Alert.alert(
                              // `${localized.t("VEHICLE_ADDED_SUCCESSFULLY")}`,
                              "Pickup Delivered",
                              // `${localized.t("YOUR_VEHICLE_HAS_BEEN_ADDED_SUCCESSFULLY")}`,
                              "You have delivered the pickup request.",
                              [
                                {
                                  text: "OK",
                                  onPress: () => {setOtp(true)},
                                  style: "default",
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
                      buttonStyle={styles.buttonHistoryStyles}
                      titleStyle={styles.titleMainStyle}
                    />
                  )}
                </View>
              ) : (
                <View>
                  <Formik
                    // validationSchema={AddDonations}
                    initialValues={{
                      otp: "",
                    }}
                    onSubmit={async ({ otp }) => {
                      setLoading(true);
                      try {
                        setResponse({
                          loading: true,
                          message: "",
                          error: false,
                        });
                        const data = {
                          otp: otp,
                          requestId: pickupId,
                          otpType: otpType
                        };
                        const res = await dispatch(
                          updatePickupRequest(data as any) as any
                        );
                        if (res?.payload?.success == true) {
                          setLoading(false);
                          setResponse({
                            loading: false,
                            message: "",
                            error: false,
                          });
                          setLoading(false);
                          Alert.alert(
                            `${localized.t("THAN_YOU_FOR_DONATION")}`,
                            `${localized.t(
                              "WH_HAVE_SUCCESSFULLY_ADDED_YOUR_DONATION"
                            )}`,
                            [
                              {
                                text: `${localized.t("OK")}`,
                                onPress: () => {setOtp(true)},
                                style: "default",
                              },
                            ],
                            { cancelable: false }
                          );
                        } else {
                          setLoading(false);
                          console.log("Error");
                        }
                      } catch (err: any) {
                        setLoading(false);
                        setResponse({
                          loading: false,
                          message: err.message,
                          error: true,
                        });
                        Alert.alert(
                          `${localized.t("DONATION_NOT_ADDED")}`,
                          `${err.message}`,
                          [{ text: `${localized.t("OK")}` }],
                          { cancelable: false }
                        );
                      }
                    }}
                  >
                    {({
                      handleSubmit,
                      handleBlur,
                      handleChange,
                      values,
                      setFieldValue,
                      errors,
                      touched,
                      isValid,
                    }) => (
                      <>
                        <TextInput
                          onChangeText={handleChange("otp")}
                          onBlur={handleBlur("otp")}
                          value={values?.otp}
                          placeholder="Please enter OTP"
                          placeholderTextColor={"black"}
                          style={[styles.textInput]}
                        />
                        {/* <Text style={styles.inputError}>
                          {errors?.foodItem}
                        </Text> */}
                        <View
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: h2dp(1),
                          }}
                        >
                          <PrimaryButton
                            title={localized.t("SUBMIT")}
                            buttonStyle={styles.buttonStyles}
                            titleStyle={styles.titleStyle}
                            onPress={handleSubmit}
                          />
                        </View>
                      </>
                    )}
                  </Formik>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default PickupConfirmScreen;
