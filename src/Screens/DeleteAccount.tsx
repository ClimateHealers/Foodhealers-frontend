import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Modal, Text } from "react-native-paper";
import {
  heightPercentageToDP as hp2dp,
  widthPercentageToDP as wp2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { systemWeights } from "react-native-typography";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, removeAuthData } from "../redux/actions/authAction";
import { logOut } from "../redux/reducers/authreducers";
import { localized } from "../locales/localization";
import PrimaryButton from "../Components/PrimaryButton";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState<Boolean>(false);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const userInfo = useSelector((state: any) => state.auth.data.user);

  const deleteAccount = async () => {
    const res = await dispatch(deleteUser({} as any) as any);

    if (res?.payload?.success) {
      removeAuthData();
      await dispatch(logOut({} as any) as any);
      setShowModal(true);
    }
  };

  const navigateToLoginScreen = () => {
    setShowModal(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  return (
    <LinearGradient
      colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {localized.t("DELETE_ACCOUNT")}
          </Text>
          <View style={{ width: wp2dp(3) }} />
        </View>

        <ScrollView style={styles.ScrollView}>
          <View style={styles.profile}>
            <Text style={styles.profileName}>{userInfo?.name}</Text>
            <Text style={{ color: "white", fontSize: hp2dp(2.0) }}>
              {userInfo?.email}
            </Text>
          </View>
          <View style={{ alignSelf: "center", marginVertical: 30 }}>
            <AntDesign name="deleteuser" size={150} color="#faf5f5" />
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                fontSize: hp2dp(2.8),
                fontWeight: "bold",
                alignSelf: "center",
                marginBottom: 20,
                color: "white",
              }}
            >
              {localized.t("ATTENTION")}
            </Text>
            <Text
              style={{
                color: "white",
              }}
            >
              {localized.t("DELETE_YOUR_ACCOUNT_WILL_REMOVE_DATABASE")}{" "}
              {localized.t("THIS_CANNOT_BE_UNDONE")}
            </Text>
          </View>
        </ScrollView>
        <Modal visible={showModal} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{localized.t("ALMOST_DONE")}</Text>
              <Text style={styles.modalSubText}>
                {localized.t("WE_RECEIVED__YOUR_REQUEST_TO_DELETE")}
                {localized.t("TO_COMPLETE_YOUR_DELETION")}
              </Text>
              <TouchableOpacity
                onPress={navigateToLoginScreen}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>{localized.t("CLOSE")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ paddingBottom: hp2dp(2) }}>
          <PrimaryButton
            title={localized.t("DELETE_ACCOUNT")}
            buttonStyle={styles.googleBtn}
            titleStyle={styles.googletext}
            onPress={deleteAccount}
          />
          <PrimaryButton
            title={localized.t("KEEP_ACCOUNT")}
            buttonStyle={[
              styles.googleBtn,
              {
                backgroundColor: "gray",
              },
            ]}
            titleStyle={styles.googletext}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp2dp(4.5),
    paddingTop: hp2dp(8),
  },
  header: {
    position: "absolute",
    top: 0,
    left: hp2dp(-2.6),
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp2dp(4.5),
    paddingTop: hp2dp(3),
    paddingBottom: hp2dp(2),
  },
  headerTitle: {
    fontSize: wp2dp(5),
    color: "white",
    fontWeight: "bold",
  },
  ScrollView: {
    flex: 1,
    paddingHorizontal: wp2dp(3),
    paddingTop: hp2dp(2),
    marginBottom: hp2dp(2),
  },
  profile: {
    alignItems: "center",
    marginVertical: hp2dp(2),
  },
  profileName: {
    paddingTop: hp2dp(1),
    ...systemWeights.bold,
    color: "white",
    fontSize: hp2dp(2.2),
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: hp2dp(1.8),
    fontWeight: "bold",
    color: "black",
    marginBottom: hp2dp(1.5),
    textAlign: "center",
  },
  modalSubText: {
    fontSize: hp2dp(1.8),
    color: "black",
    textAlign: "center",
  },
  modalButton: {
    marginTop: hp2dp(3),
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: hp2dp(1.6),
  },

  googleBtn: {
    backgroundColor: "#FC5A56",
    borderRadius: wp2dp(2),
    marginTop: hp2dp(2),
    height: hp2dp(6),
    justifyContent: "center",
    alignItems: "center",
  },
  googletext: {
    color: "white",
    fontSize: hp2dp(2.1),
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeleteAccount;
