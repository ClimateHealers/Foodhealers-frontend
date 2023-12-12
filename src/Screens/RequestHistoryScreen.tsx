import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
import ReactNativeSegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allRequests } from "../redux/actions/allRequests";
import { myRequests } from "../redux/actions/myRequests";

const RequestHistoryScreen = ({ route }: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { itemTypeId, title } = route?.params;
  const menuItem = "Team";
  const [menuClose, setMenuOpen] = useState(false);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [requestData, setRequestData]: any = useState<[]>([]);
  useEffect(() => {
    fetchingRequestData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...requestData].sort((a: any, b: any) => {
      const dateA = new Date(a?.createdAt);
      const dateB = new Date(b?.createdAt);

      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        setFilterName(`${localized.t("OLD")}`);
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setRequestData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const dispatch = useDispatch();
  const fetchingRequestData = async () => {
    const response = await dispatch(myRequests({ itemTypeId } as any) as any);
    if (itemTypeId === 1) {
      const filteredrequestData = response?.payload?.requestList.filter(
        (event: any) => event?.type === "Food"
      );
      setRequestData(filteredrequestData);
    } else if (itemTypeId === 2) {
      const filteredrequestData = response?.payload?.requestList.filter(
        (event: any) => event?.type === "Supplies"
      );
      setRequestData(filteredrequestData);
    } else {
      setRequestData(response?.payload?.requestList);
    }
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingRequestData();
    } else if (index === 1) {
      const response = await dispatch(
        allRequests({ itemTypeId } as any) as any
      );
      if (itemTypeId === 1) {
        const filteredrequestData = response?.payload?.AllRequests.filter(
          (event: any) => event?.type === "Food"
        );
        const ApprovedDonation = filteredrequestData.filter(
          (event: any) => event?.status === "approved"
        );
        setRequestData(ApprovedDonation);
      } else if (itemTypeId === 2) {
        const filteredrequestData = response?.payload?.AllRequests.filter(
          (event: any) => event?.type === "Supplies"
        );
        const ApprovedDonation = filteredrequestData.filter(
          (event: any) => event?.status === "approved"
        );
        setRequestData(ApprovedDonation);
      } else {
        setRequestData(response?.payload?.AllRequests);
      }
    }
  };

  const Item = ({
    foodItem,
    status,
    delivery,
    requiredDate,
    type,
    delivered,
    driver,
    pickupDate,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        {delivered === true ? (
          <View>
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
              {localized.t("DELIVERED")}
            </Text>
          </View>
        ) : driver !== "Driver not specified" ? (
          <View>
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
              {localized.t("IN_TRANSIT")}
            </Text>
          </View>
        ) : pickupDate !== "Pickup date not specified" ? (
          <View>
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
              {localized.t("ACCEPTED")}
            </Text>
          </View>
        ) : status === "approved" ? (
          <View>
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
            {type === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                }}
              />
            )}
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
              fontSize: 16,
              lineHeight: 30,
              paddingTop: h2dp(0.5),
            }}
          >
            {moment(requiredDate).format("MMM DD, YYYY  ddd, hh:mm A")}
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
                {localized.t("REQUESTS_HISTORY")}
              </Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
              menuItem={menuItem}
            />
          </View>
          <View style={styles.toggle}>
            <ReactNativeSegmentedControlTab
              values={[
                `${localized.t("MY_REQUESTS")}`,
                `${localized.t("ALL_REQUESTS")}`,
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
          {requestData?.length > 0 ? (
            <View style={{ flex: 1 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={requestData}
                renderItem={({ item }: any) => (
                  <Item
                    status={item?.status}
                    type={item?.type}
                    id={item.id}
                    foodItem={`${item?.foodItem}  (${item?.quantity})`}
                    delivery={item?.deliver?.dropAddress?.fullAddress}
                    requiredDate={item?.requiredDate}
                    delivered={item?.deliver?.delivered}
                    driver={item?.deliver?.driver}
                    pickupDate={item?.deliver?.pickupDate}
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
    </TouchableWithoutFeedback>
  );
};

export default RequestHistoryScreen;
