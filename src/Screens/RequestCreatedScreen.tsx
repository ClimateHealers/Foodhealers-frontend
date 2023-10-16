import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
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

const RequestCreatedScreen = ({ route }: any) => {
  const { itemTypeId, title, foodItem, address, eventDateTime } = route?.params;
  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
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
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{title}</Text>
                </View>
                <BurgerIcon />
              </View>
              <View style={{ height: h2dp(47), marginTop: h2dp(3) }}>
                <View style={styles.cardContainer}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                      style={{
                        marginLeft: w2dp(3),
                        fontSize: 16,
                        lineHeight: 30,
                        paddingTop: h2dp(0.5),
                      }}
                    >
                      {eventDateTime}
                    </Text>
                    <Text
                      style={{
                        marginLeft: w2dp(3),
                        fontWeight: "500",
                        fontSize: 16,
                        lineHeight: 30,
                      }}
                    >
                      {foodItem}
                    </Text>
                    <Text
                      style={{
                        marginLeft: w2dp(3),
                        fontWeight: "300",
                        fontSize: 16,
                        lineHeight: 20,
                        paddingBottom: h2dp(1),
                      }}
                    >
                      {address}
                    </Text>
                  </ScrollView>
                </View>
              </View>
              <View>
                <PrimaryButton
                  title={localized.t("REQUEST_MORE")}
                  onPress={() =>
                    navigation.navigate("AddRequestDonationsScreen", {
                      itemTypeId: itemTypeId,
                      title: title,
                    })
                  }
                  buttonStyle={styles.buttonStyles}
                  titleStyle={styles.titleMainStyle}
                />
              </View>
              <View>
                <PrimaryButton
                  title={localized.t("SEE_ALL_REQUESTS")}
                  onPress={() =>
                    navigation.navigate("RequestHistoryScreen", {
                      itemTypeId: itemTypeId,
                      title: title,
                    })
                  }
                  buttonStyle={styles.buttonHistoryStyles}
                  titleStyle={styles.titleMainStyle}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default RequestCreatedScreen;
