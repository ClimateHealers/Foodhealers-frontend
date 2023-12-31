import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Keyboard,
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
import { fetchVolunteerAtEvent } from "../redux/actions/volunteerAction";

const VolunteerEventHistoryScreen = ({ route }: any) => {
  const { itemTypeId, title } = route?.params;
  const [menuClose, setMenuOpen] = useState(false);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [volunteerData, setVolunteerData]: any = useState<[]>([]);
  useFocusEffect(
    useCallback(() => {
      fetchingVolunteerEventData();
      sortByDate();
    }, [])
  );

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...volunteerData].sort((a: any, b: any) => {
      const dateA = new Date(a?.fromDate);
      const dateB = new Date(b?.fromDate);

      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        setFilterName(`${localized.t("OLD")}`);
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setVolunteerData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const dispatch = useDispatch();

  const fetchingVolunteerEventData = async () => {
    const response = await dispatch(fetchVolunteerAtEvent({} as any) as any);
    const filteredData = response?.payload?.volunteerHistory?.filter(
      (event: any) => event?.event?.active === true
    );
    setVolunteerData(filteredData);
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const Item = ({ status, fromDate, name, address, id }: any) => (
    <TouchableOpacity activeOpacity={1}>
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
                fontSize: h2dp(1.1),
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontSize: h2dp(1.6),
              lineHeight: 30,
              paddingTop: h2dp(0.5),
            }}
          >
            {moment(fromDate).format("MMM DD, YYYY  ddd, hh:mm A")}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "500",
              fontSize: h2dp(1.6),
              lineHeight: 30,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "300",
              fontSize: h2dp(1.6),
              lineHeight: 20,
              paddingBottom: h2dp(1),
            }}
          >
            {address}
          </Text>
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
        <View style={styles.container}>
          <FoodhealersHeader />
          <View style={styles.root}>
            <Ionicons
              name="chevron-back"
              size={32}
              color="white"
              onPress={() => {navigation.goBack(),handlePressOutside()}}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {localized.t("VOLUNTEER")} {localized.t("EVENT_HISTORY")}
              </Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>
          <View style={styles.itemFilter}>
            <Text style={styles.itemFilterText}>
              {localized.t("ALL_HISTORY")}
            </Text>
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
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
          <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={volunteerData}
              renderItem={({ item }: any) => (
                <Item
                  status={item?.event?.status}
                  id={item?.id}
                  name={item?.event?.name}
                  address={item?.event?.address?.fullAddress}
                  fromDate={item?.fromDate}
                />
              )}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerEventHistoryScreen;
