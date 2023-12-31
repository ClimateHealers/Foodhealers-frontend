import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Button } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { heightPercentageToDP as h2dp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import PrimaryButton from "../Components/PrimaryButton";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { postEvent } from "../redux/actions/postEventaction";

const EventPhotosScreen = ({ route }: any) => {
  const { eventPhotos, eventFormData, singlePhoto } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const navigation: any = useNavigation<string>();

  const submitEvent = () => {
    setShowDialog(true);
  };
  const formData = new FormData();
  formData.append("eventName", eventFormData?.eventName);
  formData.append("lat", eventFormData?.lat);
  formData.append("lng", eventFormData?.long);
  formData.append("alt", "0");
  formData.append("fullAddress", eventFormData?.address);
  formData.append("postalCode", eventFormData?.postalCode);
  formData.append("state", eventFormData?.state);
  formData.append("city", eventFormData?.city);
  formData.append("eventStartDate", eventFormData?.eventDate);
  formData.append("eventEndDate", eventFormData?.eventEndDateTime);
  formData.append("additionalInfo", eventFormData?.served);
  formData.append("requiredVolunteers", eventFormData?.volunteers);
  formData.append("files", {
    uri: singlePhoto,
    type: "image/jpeg",
    name: `${eventFormData?.eventDate}.jpg`,
  });

  const naivgateToAllEvents = async () => {
    try {
      setLoading(true);
      const response = await dispatch(postEvent(formData as any) as any);
      if (response?.payload?.success === true) {
        setLoading(false);
        setShowDialog(false);
        navigation.navigate("AllEventScreen", {
          fromEventPhotosScreen: true,
        });
      } else {
        setLoading(false);
        setShowDialog(false);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  return (
    <TouchableWithoutFeedback onPress={() => handlePressOutside()}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
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
                  onPress={() => {navigation.goBack(),handlePressOutside()}}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {localized.t("POST_AN_EVENT")}
                  </Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <Modal
                visible={showDialog}
                onRequestClose={() => navigation.navigate("EventPhotosScreen")}
                transparent
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.HeaderText}>
                      {localized.t("SUBMITTED_YOUR_EVENT")}
                    </Text>
                    <Text style={styles.modalText}>
                      {localized.t("YOUR_EVENT")} "{eventFormData?.eventName}"{" "}
                      {localized.t("HAS_BEEN_SUBMITTED")}.{" "}
                      {localized.t("IF_YOU_WISH_TO_CHANGE")}
                    </Text>
                    <View style={styles.buttonContainer}>
                      <Button
                        title={localized.t("RESUBMIT")}
                        type="solid"
                        buttonStyle={{
                          backgroundColor: "green",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                        }}
                        titleStyle={{
                          fontSize: h2dp(2.0),
                        }}
                        onPress={() => {navigation.navigate("PostEvent"),handlePressOutside()}}
                      />
                      <Button
                        title={localized.t("NEXT")}
                        type="solid"
                        buttonStyle={{
                          backgroundColor: "green",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                        }}
                        titleStyle={{
                          fontSize: h2dp(2.0),
                        }}
                        onPress={naivgateToAllEvents}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ fontSize: h2dp(2.5), color: "white" }}>
                  {localized.t("SELECTED_PHOTOS")}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    height: h2dp(45),
                    borderRadius: h2dp(1),
                    alignItems: "center",
                    marginTop: h2dp(2),
                  },
                ]}
              >
                {eventPhotos.map((imageUri: any, index: any) => (
                  <View
                    style={{ marginTop: h2dp(3), justifyContent: "center" }}
                    key={index}
                  >
                    <Image
                      key={index}
                      source={{ uri: imageUri }}
                      style={{ width: 100, height: 100 }}
                    />
                  </View>
                ))}
              </View>
              <View>
                <Spinner
                  visible={loading}
                  textContent={localized.t("POSTING_EVENT")}
                  cancelable={false}
                  textStyle={{
                    color: "white",
                  }}
                />
                <PrimaryButton
                  title={localized.t("SUBMIT")}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleStyle}
                  onPress={submitEvent}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EventPhotosScreen;
