import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  Platform,
  Keyboard,
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
import { allEvents } from "../redux/actions/allEvents";
import { SafeAreaView } from "react-native-safe-area-context";

const FindFoodEventsScreen = () => {
  const [eventData, setEventData]: any = useState([]);
  const [menuClose, setMenuOpen] = useState(false);
  const [filterName, setFilterName] = useState(`${localized.t("NEW")}`);
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const fetchingEventData = async () => {
    const res = await dispatch(allEvents({} as any) as any);
    const foodEvents = res?.payload?.foodEvents;
    const verifiedFoodEvents = foodEvents?.filter(
      (event: any) => event.status === "approved"
    );
    setEventData(verifiedFoodEvents || []);
  };

  useEffect(() => {
    fetchingEventData();
  }, []);

  const sortByDate = () => {
    const sorted = [...eventData].sort((a: any, b: any) => {
      const dateA = new Date(a?.eventStartDate);
      const dateB = new Date(b?.eventStartDate);
      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA.valueOf() - dateB.valueOf();
      } else {
        setFilterName(`${localized.t("OLD")}`);
        return dateB.valueOf() - dateA.valueOf();
      }
    });
    setEventData(sorted);
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const openMaps = (lat: number, lng: number, address: any) => {
    const label = address || localized.t("SELECTED_LOCATION");
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const Item = ({ event }: any) => {
    const { id, address, eventStartDate, status, name } = event;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate("EventDetailsScreen", {
            eventDetails: event,
          });
        }}
      >
        <View style={[styles.cardContainer, { paddingHorizontal: 5 }]}>
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
                  fontSize: h2dp(1.1),
                  color: "green",
                  marginTop: h2dp(0.5),
                }}
              >
                {localized.t("VERIFIED")}
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
                  fontSize: h2dp(1.1),
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
                  fontSize: h2dp(1.1),
                  color: "red",
                  marginTop: h2dp(0.5),
                }}
              >
                {localized.t("REJECTED")}
              </Text>
            </View>
          )}

          <View style={{ flex: 1, paddingVertical: h2dp(1.5) }}>
            <Text
              style={{
                marginLeft: w2dp(5),
                fontSize: h2dp(1.6),
                lineHeight: 30,
                paddingTop: h2dp(0.5),
              }}
            >
              {moment(eventStartDate).format("MMM DD, YYYY  ddd, hh:mm A")}
            </Text>
            <Text
              style={{
                marginLeft: w2dp(5),
                width: w2dp(52),
                fontWeight: "bold",
                fontSize: h2dp(1.6),
                lineHeight: 30,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                marginLeft: w2dp(5),
                fontWeight: "200",
                fontSize: h2dp(1.6),
                lineHeight: 20,
                paddingBottom: h2dp(1),
              }}
            >
              📍 {address?.fullAddress || localized.t("ADDRESS_NOT_AVAILABLE")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
              onPress={() => navigation.navigate("HomeScreen")}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {localized.t("SEE_ALL_EVENTS")}
              </Text>
            </View>
            <BurgerIcon
              menuItem={"Find Food"}
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>

          <View style={styles.itemFilter}>
            <Text style={styles.itemFilterText}>{localized.t("EVENTS")}</Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={sortByDate}
            >
              <Text style={styles.itemFilterText}>{localized.t("FILTER")}</Text>
              <Text style={styles.filterNameText}>({filterName})</Text>
              <MaterialIcons
                name="filter-list-alt"
                style={styles.itemFilterText}
              />
            </TouchableOpacity>
          </View>

          {eventData?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={eventData}
              keyExtractor={(item: any, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={({ item }: any) => {
                return <Item event={item} />;
              }}
            />
          ) : (
            <View style={[styles.centeredView, { flex: 1 }]}>
              <Text style={{ color: "white" }}>
                {localized.t("NOTHING_TO_SHOW")}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default FindFoodEventsScreen;
