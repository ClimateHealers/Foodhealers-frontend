import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { notfifications } from "../redux/actions/notificationAction";

export default function NotificationScreen() {
  const navigation: any = useNavigation();
  const [menuClose, setMenuOpen] = useState(false);
  const [notificationData, setNotificationData]: any = useState<[]>([]);

  useEffect(() => {
    fetchingNotificationsData();
    sortById();
  }, []);
  const sortById = () => {
    const postListFiltered = [...notificationData].sort((a: any, b: any) => {
      console.log("jbfjdsbjs", a.id - b.id);
      return a.id - b.id;
    });
    setNotificationData(postListFiltered);
  };

  const dispatch = useDispatch();
  const fetchingNotificationsData = async () => {
    const response = await dispatch(notfifications({} as any) as any);
    console.log("kjnckjsdvnkd", response?.payload);
    setNotificationData(response?.payload?.notifications);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const Item = ({ title, message, requiredDate }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginLeft: w2dp(3),
                fontSize: 16,
                paddingTop: h2dp(0.5),
                marginRight: w2dp(3),
              }}
            >
              {moment(requiredDate).format("MMM DD, YYYY  ddd, hh:mm A")}
            </Text>
            <Text
              style={{
                marginLeft: w2dp(3),
                fontSize: 16,
                paddingTop: h2dp(0.5),
                marginRight: w2dp(3),
              }}
            >
              {moment(new Date(requiredDate)).fromNow()}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "500",
              fontSize: 16,
              lineHeight: 30,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "300",
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: h2dp(1),
              marginRight: w2dp(3),
            }}
          >
            {message}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          ></View>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <FoodhealersHeader />
          <View style={styles.root}>
            <Ionicons
              name="chevron-back"
              size={32}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>{"Notifications"}</Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>
          <View>
            {notificationData?.length > 0 ? (
              <View style={{ height: h2dp(60), marginTop: h2dp(1) }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={notificationData}
                  renderItem={({ item }: any) => (
                    <Item
                      title={item.title}
                      message={item?.message}
                      requiredDate={item?.createdAt}
                    />
                  )}
                />
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: h2dp(10),
                  marginBottom: h2dp(10),
                }}
              >
                <Text style={styles.itemText}>
                  {localized.t("NOTHING_TO_SHOW")}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
