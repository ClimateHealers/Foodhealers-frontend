import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { addVehicle } from "../redux/actions/addVehicle";
import { addDriver, adddVehicle } from "../Components/Validation";

const AddVehicleScreen = ({ route }: any) => {
  const { newVehicle } = route?.params;
  const [loading, setLoading] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  useFocusEffect(
    useCallback(() => {
      const { routes } = navigation.getState();
      const filteredRoutes = routes.filter(
        (route: any) => route.name !== "AddDriverScreen"
      );

      navigation.reset({
        index: filteredRoutes.length - 2,
        routes: filteredRoutes,
      });
    }, [])
  );

  const dispatch = useDispatch();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const navigation: any = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.container}>
              <FoodhealersHeader />
              <View
                style={[
                  styles.root,
                  {
                    marginBottom: h2dp(7),
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  onPress={() => {
                    handlePressOutside(),
                      newVehicle
                        ? navigation.navigate("DriverRequestScreen")
                        : navigation.navigate("BecomeADriverScreen");
                  }}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{localized.t("DRIVE")}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>
              <Formik
                validationSchema={adddVehicle}
                initialValues={{
                  carModel: "",
                  carColor: "",
                  licencePlate: "",
                  carMake: "",
                }}
                onSubmit={async ({
                  carModel,
                  carColor,
                  licencePlate,
                  carMake,
                }) => {
                  setLoading(true);
                  try {
                    setResponse({
                      loading: true,
                      message: "",
                      error: false,
                    });
                    const data = {
                      model: carModel,
                      vehicleColour: carColor,
                      plateNumber: licencePlate,
                      make: carMake,
                      active: true,
                    };
                    const res = await dispatch(addVehicle(data as any) as any);
                    if (res?.payload?.success == true) {
                      if (newVehicle) {
                        setLoading(false);
                        setResponse({
                          loading: false,
                          message: `${localized.t(
                            "VEHICLE_ADDED_SUCCESSFULLY"
                          )}`,
                          error: false,
                        });
                        setLoading(false);
                        Alert.alert(
                          `${localized.t("VEHICLE_ADDED_SUCCESSFULLY")}`,
                          `${localized.t(
                            "YOUR_VEHICLE_HAS_BEEN_ADDED_SUCCESSFULLY"
                          )}`,
                          [
                            {
                              text: "OK",
                              onPress: () => {
                                navigation.navigate("DriverRequestScreen");
                                handlePressOutside();
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      } else {
                        setLoading(false);
                        setResponse({
                          loading: false,
                          message: `${localized.t(
                            "VEHICLE_ADDED_SUCCESSFULLY"
                          )}`,
                          error: false,
                        });
                        setLoading(false);
                        Alert.alert(
                          `${localized.t("VEHICLE_ADDED_SUCCESSFULLY")}`,
                          `${localized.t(
                            "YOUR_VEHICLE_HAS_BEEN_ADDED_SUCCESSFULLY"
                          )}`,
                          [
                            {
                              text: "OK",
                              onPress: () => {
                                navigation.navigate("DriverProfilePhoto");
                                handlePressOutside();
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      }
                    } else {
                      setLoading(false);
                      Alert.alert(
                        `${localized.t("ALERT")}`,
                        `${res?.payload}`,
                        [
                          {
                            text: `${localized.t("OK")}`,
                            style: "cancel",
                          },
                        ],
                        { cancelable: true }
                      );
                    }
                  } catch (err: any) {
                    setLoading(false);
                    setResponse({
                      loading: false,
                      message: err?.message,
                      error: true,
                    });
                    Alert.alert(
                      `${localized.t("VEHICLE_NOT_ADDED")}`,
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
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "white" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("carMake")}
                          onBlur={handleBlur("carMake")}
                          value={values.carMake}
                          placeholder={localized.t("VEHICLE_MAKE")}
                          placeholderTextColor={"black"}
                          style={styles.textInput}
                        />
                        <Text style={styles.inputError}>{errors.carMake}</Text>
                      </View>
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "white" },
                        ]}
                      >
                        <TextInput
                          onChangeText={handleChange("carModel")}
                          onBlur={handleBlur("carModel")}
                          value={values?.carModel}
                          placeholder={localized.t("VEHICLE_MODEL")}
                          placeholderTextColor={"black"}
                          style={styles.textInput}
                        />
                        <Text style={styles.inputError}>
                          {errors?.carModel}
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      onChangeText={handleChange("carColor")}
                      onBlur={handleBlur("carColor")}
                      value={values.carColor}
                      placeholder={localized.t("VEHICLE_COLOR")}
                      placeholderTextColor={"black"}
                      style={styles.textInput}
                    />
                    <Text style={styles.inputError}>{errors.carColor}</Text>
                    <View>
                      <TextInput
                        onChangeText={handleChange("licencePlate")}
                        onBlur={handleBlur("licencePlate")}
                        value={values?.licencePlate}
                        placeholder={localized.t("LICENSE_PLATE_NUMBER")}
                        placeholderTextColor={"black"}
                        style={[styles.textInput]}
                      />
                    </View>
                    <Text style={styles.inputError}>
                      {errors?.licencePlate}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: h2dp(1),
                      }}
                    >
                      <PrimaryButton
                        title={localized.t("NEXT")}
                        buttonStyle={styles.nextButtonStyles}
                        titleStyle={styles.titleStyle}
                        onPress={handleSubmit}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default AddVehicleScreen;
