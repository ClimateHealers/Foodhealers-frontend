import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import {
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch, useSelector } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { myEvents } from "../redux/actions/myEvents";
import { SafeAreaView } from "react-native-safe-area-context";
import { nearbyEvents } from "../redux/actions/nearbyEvents";
import { AppDispatch } from "../redux/store";

const AllEventScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuClose, setMenuOpen] = useState(false);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [myEventsData, setMyEventsData] = useState<any[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();

  const { events: nearbyEventsList } = useSelector(
    (state: any) => state.nearbyEvents
  );
  useEffect(() => {
    try {
      if (nearbyEventsList.length === 0) {
        setloading(true);
        dispatch(nearbyEvents({ radius: 50 }));
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log(error, "error during fetching nearby events");
    } finally {
      setloading(false);
    }
  }, [dispatch]);

  const fetchingMyEvents = async () => {
    const res = await dispatch(myEvents({} as any) as any);
    const foodEvents = res?.payload?.foodEvents || [];
    setMyEventsData(foodEvents);
  };

  const sortEvents = (list: any[], orderType: "ASC" | "DESC") => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a?.eventStartDate).valueOf();
      const dateB = new Date(b?.eventStartDate).valueOf();
      return orderType === "ASC" ? dateA - dateB : dateB - dateA;
    });
  };

  const sortByDate = () => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setFilterName(
      newOrder === "ASC" ? `${localized.t("NEW")}` : `${localized.t("OLD")}`
    );
    setOrder(newOrder);
  };

  const eventData = useMemo(() => {
    const list = selectedIndex === 0 ? nearbyEventsList : myEventsData;
    return sortEvents(list, order);
  }, [selectedIndex, nearbyEventsList, myEventsData, order]);

  const handleSingleIndexSelect = (index: number) => {
    setSelectedIndex(index);
    if (index === 1) {
      fetchingMyEvents();
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const Item = ({
    id,
    additionalInfo,
    address,
    eventStartDate,
    eventEndDate,
    lat,
    long,
    verified,
    status,
    eventPhoto,
    name,
    requiredVolunteers,
    eventSharingPhoto,
  }: any) => (
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
              width: w2dp(47),
              fontWeight: "200",
              fontSize: h2dp(1.6),
              lineHeight: 20,
              paddingBottom: h2dp(1),
            }}
          >
            {address}
          </Text>
        </ScrollView>
        <Button
          title={localized.t("DETAILS")}
          onPress={() => {
            handlePressOutside(),
              navigation.navigate("SingleEventDetails", {
                eventDetails: {
                  id,
                  name,
                  additionalInfo,
                  address,
                  eventStartDate,
                  eventEndDate,
                  lat,
                  long,
                  eventPhoto,
                  requiredVolunteers,
                  status,
                  eventSharingPhoto,
                },
              });
          }}
          buttonStyle={{
            marginLeft: w2dp(3),
            marginRight: w2dp(5),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "red",
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}
          titleStyle={{
            color: "black",
          }}
        />
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
              onPress={() => {
                navigation.navigate("HomeScreen"), handlePressOutside();
              }}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {localized.t("SEE_ALL_EVENTS")}
              </Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
            />
          </View>
          <View style={styles.toggle}>
            <SegmentedControlTab
              values={[
                `${localized.t("ALL_EVENTS")}`,
                `${localized.t("MY_EVENTS")}`,
              ]}
              selectedIndex={selectedIndex}
              tabsContainerStyle={{
                width: w2dp(50),
                height: h2dp(6),
              }}
              tabTextStyle={{
                color: "black",
                fontWeight: "400",
              }}
              tabStyle={styles.tabStyle}
              activeTabStyle={{
                backgroundColor: "#EDC258",
              }}
              activeTabTextStyle={{ color: "black" }}
              onTabPress={handleSingleIndexSelect}
            />
          </View>
          <View style={styles.itemFilter}>
            <Text style={styles.itemFilterText}>{localized.t("EVENTS")}</Text>
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
          {eventData?.length > 0 ? (
            <View style={{ flex: 1 }}>
              {loading ? (
                <Spinner
                  visible={loading}
                  textContent={localized.t("LOADING_NEARBY_EVENTS")}
                  cancelable={false}
                  textStyle={{ color: "white", fontWeight: "200" }}
                />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={eventData}
                  renderItem={({ item }: any) => (
                    <Item
                      id={item.id}
                      additionalInfo={item?.additionalInfo}
                      name={item?.name}
                      address={item?.address?.fullAddress}
                      lat={item.address?.lat}
                      long={item.address?.lng}
                      eventStartDate={item?.eventStartDate}
                      eventEndDate={item?.eventEndDate}
                      verified={item?.verified}
                      status={item?.status}
                      eventPhoto={item?.eventPhoto}
                      requiredVolunteers={item?.requiredVolunteers}
                      eventSharingPhoto={item?.eventSharingPhoto}
                    />
                  )}
                  keyExtractor={(item: any) => item?.id}
                />
              )}
            </View>
          ) : (
            <View style={[styles.centeredView, { flex: 1 }]}>
              <Text style={{ color: "white" }}>
                {localized.t("NOTHING_TO_SHOW")}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => {
              navigation.navigate("PostEvent"), handlePressOutside();
            }}
          >
            <MaterialIcons name="add" size={32} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default AllEventScreen;
