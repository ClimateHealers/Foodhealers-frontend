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
  View
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";
import { myEvents } from "../redux/actions/myEvents";

const AllEventScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [eventData, setEventData]: any = useState<[]>([]);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const dispatch = useDispatch();

  const navigation: any = useNavigation();
  const fetchingEventData = async () => {
    const response = await dispatch(myEvents({} as any) as any);
    setEventData(response?.payload?.foodEvents);
  };

  useEffect(() => {
    fetchingEventData();
    sortByDate();
    const { routes } = navigation.getState();
    const filteredRoutes = routes.filter(
      (route: any) =>
        route.name !== "EventPhotosScreen" &&
        route.name !== "PostEvent" &&
        route.name !== "UploadPhotosScreen"
    );

    navigation.reset({
      index: filteredRoutes.length - 4,
      routes: filteredRoutes,
    });
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...eventData].sort((a: any, b: any) => {
      const dateA = new Date(a?.eventStartDate);
      const dateB = new Date(b?.eventStartDate);

      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        setFilterName(`${localized.t("OLD")}`);
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setEventData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingEventData();
    } else if (index === 1) {
      const res = await dispatch(allEvents({} as any) as any);
      const foodEvents = res?.payload?.foodEvents;
      const verifiedFoodEvents = foodEvents?.filter(
        (event: any) => event.status === "approved"
      );
      const activeFoodEvents = verifiedFoodEvents?.filter(
        (event: any) => event.active === true
      );
      setEventData(activeFoodEvents);
    }
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
              marginLeft: w2dp(5),
              fontSize: 16,
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
              fontWeight: "500",
              fontSize: 16,
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
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: h2dp(1),
            }}
          >
            {address}
          </Text>
        </ScrollView>
        <Button
          title={localized.t("DETAILS")}
          onPress={() =>
            navigation.navigate("SingleEventDetails", {
              eventDetails: {
                id: id,
                name: name,
                additionalInfo: additionalInfo,
                address: address,
                eventStartDate: eventStartDate,
                eventEndDate: eventEndDate,
                lat: lat,
                long: long,
                eventPhoto: eventPhoto,
                requiredVolunteers: requiredVolunteers,
                status: status,
              },
            })
          }
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
            fontWeight: "300",
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
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
              onPress={() => navigation.navigate("EventsHomeScreen")}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {localized.t("SEE_ALL_EVENTS")}
              </Text>
            </View>
            <BurgerIcon />
          </View>
          <View style={styles.toggle}>
            <SegmentedControlTab
              values={[
                `${localized.t("MY_EVENTS")}`,
                `${localized.t("ALL_EVENTS")}`,
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
                  />
                )}
                keyExtractor={(item: any) => item?.id}
              />
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: h2dp(25),
              }}
            >
              <Text style={styles.itemText}>
                {localized.t("NOTHING_TO_SHOW")}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </>
  );
};

export default AllEventScreen;
