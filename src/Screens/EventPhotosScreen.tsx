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
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
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
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <FoodhealersHeader />
            <View style={styles.root}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack(), handlePressOutside();
                }}
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
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Modal
                visible={showDialog}
                onRequestClose={() => navigation.navigate("EventPhotosScreen")}
                transparent
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: h2dp(2.5),
                        fontWeight: "bold",
                        marginBottom: h2dp(1),
                        textAlign: "center",
                      }}
                    >
                      {localized.t("SUBMITTED_YOUR_EVENT")}
                    </Text>

                    <Text
                      style={{
                        color: "black",
                        fontSize: h2dp(2),
                        textAlign: "center",
                        marginBottom: h2dp(2),
                      }}
                    >
                      {localized.t("YOUR_EVENT")} "{eventFormData?.eventName}"
                      {localized.t("HAS_BEEN_SUBMITTED")}.{" "}
                      {localized.t("IF_YOU_WISH_TO_CHANGE")}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: w2dp(4),
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Button
                          title={localized.t("RESUBMIT")}
                          type="solid"
                          buttonStyle={{
                            backgroundColor: "green",
                            paddingVertical: 12,
                            borderRadius: 8,
                          }}
                          titleStyle={{
                            fontSize: h2dp(2),
                            color: "white",
                          }}
                          onPress={() => {
                            navigation.navigate("PostEvent");
                            handlePressOutside();
                          }}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Button
                          title={localized.t("NEXT")}
                          type="solid"
                          buttonStyle={{
                            backgroundColor: "green",
                            paddingVertical: 12,
                            borderRadius: 8,
                          }}
                          titleStyle={{
                            fontSize: h2dp(2),
                            color: "white",
                          }}
                          onPress={naivgateToAllEvents}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>

              <View
                style={{
                  paddingVertical: h2dp(1),
                  paddingHorizontal: w2dp(5),
                }}
              >
                <Text
                  style={{
                    fontSize: h2dp(2.5),
                    color: "white",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {localized.t("SELECTED_PHOTOS")}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    marginTop: 0,
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {eventPhotos.map((imageUri: any, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: imageUri }}
                      style={{
                        width: w2dp(30),
                        height: h2dp(20),
                        borderRadius: 10,
                        margin: h2dp(1),
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={{ paddingVertical: h2dp(2) }}>
            <Spinner
              visible={loading}
              textContent={localized.t("POSTING_EVENT")}
              cancelable={false}
              textStyle={{ color: "white" }}
            />
            <PrimaryButton
              title={localized.t("SUBMIT")}
              buttonStyle={styles.buttonStyles}
              titleStyle={styles.titleStyle}
              onPress={submitEvent}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EventPhotosScreen;
