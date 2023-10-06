import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
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
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { myDonations } from "../redux/actions/myDonations";

const VolunteerDonationHistoryScreen = ({ route }: any) => {
  const { itemTypeId, title } = route?.params;
  const [donationData, setDonationData] = useState<[]>([]);
  useEffect(() => {
    fetchingDonationData();
  }, []);
  const dispatch = useDispatch();
  const fetchingDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    if (itemTypeId === 1) {
      const filteredDonationData = response?.payload?.donationList.filter(
        (event: any) => event?.donationType === "Food"
      );
      setDonationData(filteredDonationData);
    } else if (itemTypeId === 2) {
      const filteredDonationData = response?.payload?.donationList.filter(
        (event: any) => event?.donationType === "Supplies"
      );
      setDonationData(filteredDonationData);
    } else {
      setDonationData(response?.payload?.donationList);
    }
  };

  const navigation: any = useNavigation();

  const [langOpen, setlangOpen] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, label: "French", value: "fr" },
    { id: 2, label: "Hindi", value: "hi" },
    { id: 3, label: "Bengali", value: "be" },
    { id: 4, label: "Chinese", value: "ch" },
    { id: 5, label: "Mandarin", value: "ma" },
    { id: 6, label: "Punjabi", value: "pu" },
    { id: 7, label: "English", value: "en" },
    { id: 8, label: "Spanish", value: "es" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localized.locale);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePressOutside = () => {
    setlangOpen(false);
    Keyboard.dismiss();
  };
  const handleMenuItemPress = (item: any) => {
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if (res) {
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    setMenuOpen(false);
  };
  const Item = ({ foodItem, status, delivery, createdAt }: any) => (
    <View style={styles.cardContainer}>
      {status === "approved" ? (
        <View>
          <AntDesign
            name="checkcircleo"
            size={24}
            color="green"
            style={{
              marginLeft: h2dp(2.5),
              marginTop: h2dp(1.5),
            }}
          />
          <Text
            style={{
              marginLeft: h2dp(1.5),
              fontSize: 11,
              color: "green",
              marginTop: h2dp(0.5),
            }}
          >
            {localized.t("APPROVED")}
          </Text>
        </View>
      ) : status === "pending" ? (
        <View>
          <FontAwesome
            name="clock-o"
            size={24}
            color="#f2db0a"
            style={{
              marginLeft: h2dp(2.3),
              marginTop: h2dp(1.5),
            }}
          />
          <Text
            style={{
              marginLeft: h2dp(1.5),
              fontSize: 11,
              color: "#f2db0a",
              marginTop: h2dp(0.5),
            }}
          >
            {localized.t("PENDING")}
          </Text>
        </View>
      ) : (
        <View>
          <Feather
            name="x-circle"
            size={24}
            color="red"
            style={{ marginLeft: h2dp(2.3), marginTop: h2dp(1.5) }}
          />
          <Text
            style={{
              marginLeft: h2dp(1.5),
              fontSize: 11,
              color: "red",
              marginTop: h2dp(0.5),
            }}
          >
            {localized.t("REJECTED")}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            marginLeft: w2dp(3),
            fontSize: 16,
            lineHeight: 30,
            paddingTop: h2dp(0.5),
          }}
        >
          {moment(createdAt).format("MMM DD, YYYY  ddd, hh:mm A")}
        </Text>
        <Text
          style={{
            marginLeft: w2dp(3),
            fontWeight: "500",
            fontSize: 16,
            lineHeight: 30,
            paddingTop: h2dp(0.7),
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
          {delivery}
        </Text>
      </ScrollView>
    </View>
  );

  const changeLanguage = (itemValue: any, index: any) => {
    const selectedLanguage = lang[index].value;
    localized.locale = selectedLanguage;
    setSelectedLanguage(selectedLanguage);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <FoodhealersHeader />
              <View style={styles.root}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color="white"
                  style={{ marginTop: h2dp(3) }}
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{title} History</Text>
                </View>
                <BurgerIcon />
              </View>
              <View>
                <View style={styles.itemFilter}>
                  <Text style={styles.itemFilterText}>All History</Text>
                  <Text style={styles.itemFilterText}> Filter</Text>
                </View>
                <ScrollView style={{ flex: 1 }}>
                  <FlatList
                    data={donationData}
                    renderItem={({ item }: any) => (
                      <Item
                        status={item?.status}
                        id={item.id}
                        foodItem={`${item?.foodItem}  (${item?.quantity})`}
                        delivery={item?.delivery?.pickupAddress?.fullAddress}
                        createdAt={item?.createdAt}
                      />
                    )}
                  />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerDonationHistoryScreen;
