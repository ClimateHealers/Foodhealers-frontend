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
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import { allDonations } from "../redux/actions/allDonations";
import { myDonations } from "../redux/actions/myDonations";
import moment from "moment";
import { localized } from "../locales/localization";
import { styles } from "../Components/Styles";

const DonationTabScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [donationData, setDonationData]: any[] = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchingDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    setDonationData(response?.payload?.donationList);
  };

  const fetchingallDonationData = async () => {
    const response = await dispatch(allDonations({} as any) as any);
  };

  useEffect(() => {
    fetchingDonationData();
    fetchingallDonationData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...donationData].sort((a: any, b: any) => {
      const dateA = new Date(a?.createdAt);
      const dateB = new Date(b?.createdAt);

      if (order === "ASC") {
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setDonationData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingDonationData();
    } else if (index === 1) {
      const res = await dispatch(allDonations({} as any) as any);
      const donationsAll = res?.payload?.AllDonations;
      const verifiedDonations = donationsAll?.filter(
        (event: any) => event?.status === "approved"
      );
      setDonationData(verifiedDonations);
    }
  };

  const Item = ({
    foodItem,
    status,
    delivery,
    createdAt,
    donationType,
    donatedBy,
    quantity,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        {status === "approved" ? (
          <View>
            {donationType === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                  marginTop: h2dp(-2),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                  marginTop: h2dp(-2),
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
            {donationType === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                  marginTop: h2dp(-2),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                  marginTop: h2dp(-2),
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
            {donationType === "Supplies" ? (
              <MaterialCommunityIcons
                name="truck-outline"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.3),
                  marginTop: h2dp(1.5),
                }}
              />
            ) : (
              <Entypo
                name="bowl"
                size={24}
                color="black"
                style={{
                  marginLeft: h2dp(2.5),
                  marginTop: h2dp(1.5),
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
              fontWeight: "200",
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: h2dp(1),
              marginHorizontal: w2dp(0.5),
            }}
          >
            {delivery}
          </Text>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.toggle}>
          <SegmentedControlTab
            values={[
              `${localized.t("MY_DONATIONS")}`,
              `${localized.t("ALL_DONATIONS")}`,
            ]}
            selectedIndex={selectedIndex}
            tabsContainerStyle={{
              width: w2dp(50),
              height: h2dp(6),
              marginTop: h2dp(2),
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
            <MaterialIcons
              name="filter-list-alt"
              style={styles.itemFilterText}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={donationData}
            renderItem={({ item }: any) => (
              <Item
                donationType={item?.donationType}
                status={item?.status}
                foodItem={`${item?.foodItem}  (${item?.quantity})`}
                delivery={item?.delivery?.pickupAddress?.fullAddress}
                createdAt={item?.createdAt}
                donatedBy={item?.donatedBy?.name}
              />
            )}
            keyExtractor={(item: any) => item?.id}
          />
        </View>
      </View>
    </>
  );
};

export default DonationTabScreen;
