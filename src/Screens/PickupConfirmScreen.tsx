import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Linking,
  Modal,
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
import {
  fetchPickup,
  updatePickupRequest,
} from "../redux/actions/acceptPickupAction";
import { GenerateOTP } from "../Components/validation";

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
  const itemTypeId = 4;
  const [otp, setOtp] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const dispatch = useDispatch();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

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
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{localized.t("DRIVE")}</Text>
                </View>
                <BurgerIcon />
              </View>
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>
              <Text
                style={{
                  fontSize: 26,
                  alignSelf: "center",
                }}
              >
                {!fullfilled
                  ? `${localized.t("PICKUP_CONFIRMED")}`
                  : `${localized.t("PICKUP_COMPLETED")}`}
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

                    {!fullfilled ? (
                      <PrimaryButton
                        title={
                          pickedup
                            ? `${localized.t("PICKEDUP")}`
                            : `${localized.t("GET_DIRECTIONS")}`
                        }
                        onPress={pickNavigationHandler}
                        disabled={pickedup}
                        buttonStyle={[
                          styles.buttonStyles,
                          {
                            marginTop: h2dp(2),
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

                    {!fullfilled ? (
                      <PrimaryButton
                        title={
                          delivered
                            ? `${localized.t("DELIVERED")}`
                            : `${localized.t("GET_DIRECTIONS")}`
                        }
                        onPress={dropNavigationHandler}
                        disabled={delivered}
                        buttonStyle={[
                          styles.buttonStyles,
                          {
                            marginTop: h2dp(2),
                            marginBottom: h2dp(2),
                          },
                        ]}
                        titleStyle={styles.titleStyle}
                      />
                    ) : null}
                  </ScrollView>
                </View>
              </View>
              {!fullfilled ? (
                <View>
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
                        <View>
                          {!fullfilled ? (
                            <View>
                              <Text
                                style={{
                                  alignSelf: "center",
                                  fontSize: h2dp(2.2),
                                }}
                              >{pickedup ? `${localized.t("DROPOFF")}` : `${localized.t("PICKUP")}`}
                              </Text>
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
                                      otpType: pickedup ? "drop" : "pickup",
                                    };
                                    const res = await dispatch(
                                      otpGenerate(data as any) as any
                                    );
                                    if (res?.payload?.success == true) {
                                      setLoading(false);
                                      setResponse({
                                        loading: false,
                                        message: `${localized.t(
                                          "PICKUP_DELIVERED"
                                        )}`,
                                        error: false,
                                      });
                                      setLoading(false);
                                      {
                                        !pickedup
                                          ? Alert.alert(
                                              `${localized.t("PICKUP_OTP")}`,
                                              `${localized.t(
                                                "OTP_HAS_BEEN_GENERATED_FOR_PICKUP"
                                              )}`,
                                              [
                                                {
                                                  text: "OK",
                                                  onPress: () => {
                                                    setOtp(true);
                                                  },
                                                  style: "default",
                                                },
                                              ],
                                              { cancelable: false }
                                            )
                                          : Alert.alert(
                                              `${localized.t("DELIVERY_OTP")}`,
                                              `${localized.t(
                                                "OTP_HAS_BEEN_GENERATED_FOR_DELIVERY"
                                              )}`,
                                              [
                                                {
                                                  text: "OK",
                                                  onPress: () => {
                                                    setOtp(true);
                                                  },
                                                  style: "default",
                                                },
                                              ],
                                              { cancelable: false }
                                            );
                                      }
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
                            </View>
                          ) : null}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      <Formik
                        validationSchema={GenerateOTP}
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
                              otpType: pickedup ? "drop" : "pickup",
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
                              await dispatch(
                                fetchPickup({
                                  requestTypeId: itemTypeId,
                                } as any) as any
                              );
                              setLoading(false);
                              Alert.alert(
                                `${localized.t("SUCCESSFULL")}`,
                                `${localized.t("OTP_SUCCESS")}`,
                                [
                                  {
                                    text: `${localized.t("OK")}`,
                                    onPress: () => {
                                      setOtp(false),
                                        navigation.navigate(
                                          "PickupDetailsScreen",
                                          {
                                            itemTypeId: 4,
                                          }
                                        );
                                    },

                                    style: "default",
                                  },
                                ],
                                { cancelable: false }
                              );
                            } else {
                              setLoading(false);
                              Alert.alert(
                                `${localized.t("WRONG_OTP")}`,
                                `${localized.t("PLEASE_ENTER_VALID_OTP")}`,
                                [{ text: `${localized.t("OK")}` }],
                                { cancelable: false }
                              );
                              console.log("ERROR");
                            }
                          } catch (err: any) {
                            setLoading(false);
                            setResponse({
                              loading: false,
                              message: err.message,
                              error: true,
                            });
                            Alert.alert(
                              `${localized.t("ERROR")}`,
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
                              placeholder={localized.t("PLEASE_ENTER_OTP")}
                              placeholderTextColor={"black"}
                              style={[
                                styles.textInput,
                                {
                                  marginTop: h2dp(2),
                                },
                              ]}
                            />
                            <Text style={styles.inputError}>{errors?.otp}</Text>
                            <View
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <PrimaryButton
                                title={localized.t("SUBMIT")}
                                buttonStyle={[
                                  styles.buttonStyles,
                                  {
                                    marginTop: h2dp(2),
                                  },
                                ]}
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
              ) : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default PickupConfirmScreen;
