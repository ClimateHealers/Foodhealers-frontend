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
import { Button } from "react-native-elements";
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

  const Item = ({
    id,
    address,
    eventStartDate,
    lat,
    long,
    status,
    name,
  }: any) => (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={styles.eventCardContainer}>
        {status === "approved" ? (
          <View style={styles.statusRow}>
            <AntDesign name="checkcircleo" size={18} color="green" />
            <Text style={[styles.statusText, { color: "green" }]}>
              {localized.t("APPROVED")}
            </Text>
          </View>
        ) : status === "pending" ? (
          <View style={styles.statusRow}>
            <FontAwesome name="clock-o" size={18} color="#f2db0a" />
            <Text style={[styles.statusText, { color: "#f2db0a" }]}>
              {localized.t("PENDING")}
            </Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            <Feather name="x-circle" size={18} color="red" />
            <Text style={[styles.statusText, { color: "red" }]}>
              {localized.t("REJECTED")}
            </Text>
          </View>
        )}

        <Text style={styles.dateText}>
          {moment(eventStartDate).format("MMM DD, YYYY ddd, hh:mm A")}
        </Text>

        <Text style={styles.cardEventName}>{name}</Text>

        <View style={styles.locationRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationText} numberOfLines={2}>
              📍 {address}
            </Text>
          </View>

          <Button
            title={localized.t("GET_DIRECTIONS")}
            onPress={() => {
              if (lat && long) {
                openMaps(lat, long, address);
              } else {
                alert("Location not available");
              }
            }}
            buttonStyle={styles.directionButton}
            titleStyle={styles.directionButtonText}
          />
        </View>
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
                return (
                  <Item
                    id={item?.id}
                    name={item?.name}
                    address={item?.address?.fullAddress}
                    lat={item?.address?.lat}
                    long={item?.address?.lng}
                    eventStartDate={item?.eventStartDate}
                    status={item?.status}
                  />
                );
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
