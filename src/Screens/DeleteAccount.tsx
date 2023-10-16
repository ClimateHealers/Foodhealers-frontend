import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
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
        <ScrollView style={styles.ScrollView}>
          <View style={styles.profile}>
            <Text style={styles.profileName}>{userInfo?.name}</Text>
            <Text style={{ color: "white", fontSize: 20 }}>
              {userInfo?.email}
            </Text>
          </View>
          <View style={{ alignSelf: "center", marginVertical: 30 }}>
            <AntDesign name="deleteuser" size={150} color="#faf5f5" />
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                alignSelf: "center",
                marginBottom: 20,
                color: "white",
              }}
            >
              {localized.t("ATTENTION")}
            </Text>
            <Text style={{ fontSize: 18, color: "white" }}>
              {localized.t("DELETE_YOUR_ACCOUNT_WILL_REMOVE_DATABASE")}{" "}
              {localized.t("THIS_CANNOT_BE_UNDONE")}
            </Text>
          </View>
          <View style={{ marginVertical: hp2dp("8%") }}>
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={deleteAccount}
              >
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.googletext}>
                      {localized.t("DELETE_ACCOUNT")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.googleBtn, { backgroundColor: "#4facf7" }]}
                onPress={() => navigation.goBack()}
              >
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text
                      style={{
                        ...systemWeights.semibold,
                        color: "white",
                        fontSize: 18,
                      }}
                    >
                      {localized.t("KEEP_ACCOUNT")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Modal visible={showModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginVertical: hp2dp("2%"),
                    }}
                  >
                    {localized.t("ALMOST_DONE")}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 18, color: "black" }}>
                    {localized.t("WE_RECEIVED__YOUR_REQUEST_TO_DELETE")}{" "}
                    {localized.t("TO_COMPLETE_YOUR_DELETION")}
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginTop: hp2dp("2%") }}>
                  <TouchableOpacity
                    onPress={
                      navigateToLoginScreen
                    }
                  >
                    <View
                      style={[
                        {
                          height: 45,
                          width: 100,
                          backgroundColor: "#4facf7",
                          borderRadius: 10,
                        },
                        styles.centeredView,
                      ]}
                    >
                      <Text style={{ color: "#ffff", fontWeight: "bold" }}>
                        {localized.t("CLOSE")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },

  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginHorizontal: wp2dp("4.5%"),
  },
  ScrollView: {
    marginHorizontal: 5,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp2dp("2%"),
  },

  profileName: {
    paddingTop: 10,
    ...systemWeights.bold,
    color: "white",
    fontSize: 20,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,

    width: wp2dp("80%"),
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  googleBtn: {
    backgroundColor: "#FC5A56",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderColor: "red",
    height: 50,
    marginTop: 10,
    width: wp2dp("80%"),
    fontSize: 25,
  },
  googletext: {
    ...systemWeights.semibold,
    color: "white",
    fontSize: 18,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeleteAccount;
