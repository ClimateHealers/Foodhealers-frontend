import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
  useNavigationState,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
``;
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import {
  addVehicle,
  fetchVehicle,
  updateVehicle,
} from "../redux/actions/addVehicle";
import { addDriver, adddVehicle } from "../Components/validation";
import SelectDropdown from "react-native-select-dropdown";

const UpdateVehicleScreen = ({ route }: any) => {
  const { id } = route?.params;
  const [menuClose, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<any>();
  const [vehicleData, setVehicleData] = useState<any>();
  const [selectedVehicle, setSelectedVehicle] = useState<any>();
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const navigation: any = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchingVehiclesData();
    }, [])
  );

  const initialValue = {
    carModel: vehicleDetails?.model,
    carColor: vehicleDetails?.vehicleColour,
    licencePlate: vehicleDetails?.plateNumber,
    carMake: vehicleDetails?.make,
  };

  const fetchingVehiclesData = async () => {
    setLoading(true);
    const response = await dispatch(fetchVehicle({} as any) as any);
    const filteredVehicle = response?.payload?.vehicleDetails?.filter(
      (event: any) => event.id === id
    );
    setVehicleDetails(filteredVehicle[0]);
    const data = response?.payload?.vehicleDetails;
    setVehicleData(data);
    setLoading(false);
  };

  const dispatch = useDispatch();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const changeVehicle = async (itemValue: any, index: any) => {
    setLoading(true);
    let selectedVehicleID = vehicleData[index]?.make;
    setSelectedVehicle(selectedVehicleID);
    const response = await dispatch(fetchVehicle({} as any) as any);
    const filteredVehicle = response?.payload?.vehicleDetails[index];
    setVehicleDetails(filteredVehicle);
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
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
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>
              <Formik
                validationSchema={adddVehicle}
                isInitialValid
                enableReinitialize
                initialValues={initialValue}
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
                      vehicleId: id,
                    };
                    const res = await dispatch(
                      updateVehicle(data as any) as any
                    );
                    if (res?.payload?.success == true) {
                      setLoading(false);
                      setResponse({
                        loading: false,
                        message: `${localized.t(
                          "VEHICLE_UPDATED_SUCCESSFULLY"
                        )}`,
                        error: false,
                      });
                      setLoading(false);
                      Alert.alert(
                        `${localized.t("VEHICLE_UPDATED_SUCCESSFULLY")}`,
                        `${localized.t(
                          "YOUR_VEHICLE_HAS_BEEN_UPDATED_SUCCESSFULLY"
                        )}`,
                        [
                          {
                            text: "OK",
                            onPress: () =>
                              navigation.navigate("DriverRequestScreen"),
                          },
                        ],
                        { cancelable: false }
                      );
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
                      `${localized.t("VEHICLE_NOT_UPDATED")}`,
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
                          { backgroundColor: "#deddd9" },
                        ]}
                      >
                        <TextInput
                          disabled={true}
                          onChangeText={handleChange("carMake")}
                          onBlur={handleBlur("carMake")}
                          value={values.carMake}
                          placeholder={vehicleDetails?.make}
                          placeholderTextColor={"black"}
                          style={[
                            styles.textInput,
                            { backgroundColor: "#deddd9" },
                          ]}
                        />
                        <Text style={styles.inputError}>{errors?.carMake}</Text>
                      </View>
                      <View
                        style={[
                          styles.dateTimePickerContainer,
                          { backgroundColor: "#deddd9" },
                        ]}
                      >
                        <TextInput
                          disabled={true}
                          onChangeText={handleChange("carModel")}
                          onBlur={handleBlur("carModel")}
                          value={values?.carModel}
                          placeholder={vehicleDetails?.model}
                          placeholderTextColor={"black"}
                          style={[
                            styles.textInput,
                            { backgroundColor: "#deddd9" },
                          ]}
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
                      placeholder={vehicleDetails?.vehicleColour}
                      placeholderTextColor={"black"}
                      style={[styles.textInput]}
                    />
                    <Text style={styles.inputError}>{errors?.carColor}</Text>
                    <View>
                      <TextInput
                        disabled={true}
                        onChangeText={handleChange("licencePlate")}
                        onBlur={handleBlur("licencePlate")}
                        value={values?.licencePlate}
                        placeholder={vehicleDetails?.plateNumber}
                        placeholderTextColor={"black"}
                        style={[
                          styles.textInput,
                          { backgroundColor: "#deddd9" },
                        ]}
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
                      <SelectDropdown
                        buttonStyle={{
                          width: w2dp(50),
                          height: h2dp(5),
                          backgroundColor: "#FFF",
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: "#D1D1D6",
                        }}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        renderDropdownIcon={() => {
                          return (
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              size={18}
                              color="#B50000"
                            />
                          );
                        }}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={{
                          color: "black",
                          textAlign: "center",
                          fontSize: 16,
                        }}
                        data={
                          vehicleData &&
                          vehicleData.map((dd: any) => {
                            return (
                              dd?.make +
                              " " +
                              dd?.model +
                              "  " +
                              dd?.plateNumber
                            );
                          })
                        }
                        onSelect={changeVehicle}
                        defaultButtonText={selectedVehicle?.toUpperCase()}
                        rowTextForSelection={(item, index) => {
                          return item;
                        }}
                      />
                      <PrimaryButton
                        title={localized.t("UPDATE")}
                        buttonStyle={styles.nextButtonStyles}
                        titleStyle={styles.titleStyle}
                        onPress={handleSubmit}
                      />
                      <PrimaryButton
                        title={localized.t("ADD_NEW_VEHICLE")}
                        buttonStyle={styles.nextButtonStyles}
                        titleStyle={styles.titleStyle}
                        onPress={() => {
                          navigation.navigate("AddVehicleScreen", {
                            newVehicle: true,
                          });
                        }}
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

export default UpdateVehicleScreen;
