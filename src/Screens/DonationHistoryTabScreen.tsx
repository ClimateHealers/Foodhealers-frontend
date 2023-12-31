import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { myDonations } from "../redux/actions/myDonations";

const DonationHistoryTabScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [donationData, setDonationData]: any[] = useState<[]>([]);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchingFoodDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    const donationsAll = response?.payload?.donationList;
    const verifiedDonations = donationsAll?.filter(
      (event: any) => event?.donationType === "Food"
    );
    setDonationData(verifiedDonations);
  };

  useEffect(() => {
    fetchingFoodDonationData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...donationData].sort((a: any, b: any) => {
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
    setDonationData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingFoodDonationData();
    } else if (index === 1) {
      setLoading(true);
      const res = await dispatch(myDonations({} as any) as any);
      const donationsAll = res?.payload?.donationList;
      const verifiedDonations = donationsAll?.filter(
        (event: any) => event?.donationType === "Supplies"
      );
      setDonationData(verifiedDonations);
      setLoading(false);
    }
  };

  const Item = ({
    foodItem,
    status,
    delivery,
    createdAt,
    pickupDate,
    donationType,
    dropDate,
    delivered,
    driver,
    donatedBy,
    quantity,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        {delivered === true ? (
          <View>
            {donationType === "Supplies" ? (
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
            {donationType === "Supplies" ? (
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
        ) : dropDate !== "Drop date not specified" ? (
          <View>
            {donationType === "Supplies" ? (
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
            {donationType === "Supplies" ? (
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
            {donationType === "Supplies" ? (
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
            {donationType === "Supplies" ? (
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
              fontSize: h2dp(1.6),
              lineHeight: 30,
              paddingTop: h2dp(0.5),
            }}
          >
            {moment(pickupDate).format("MMM DD, YYYY  ddd, hh:mm A")}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "500",
              fontSize: h2dp(1.6),
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
              fontSize: h2dp(1.6),
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
            values={[`${localized.t("FOOD")}`, `${localized.t("SUPPLIES")}`]}
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
        <Modal visible={loading} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={"large"} />
            </View>
          </View>
        </Modal>
        <View style={styles.itemFilter}>
          <Text style={styles.itemFilterText}>{localized.t("DONATIONS")}</Text>
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
        {donationData?.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={donationData}
              renderItem={({ item }: any) => (
                <Item
                  donationType={item?.donationType}
                  status={item?.status}
                  pickupDate={item?.delivery?.pickupDate}
                  foodItem={`${item?.foodItem}  (${item?.quantity})`}
                  delivery={item?.delivery?.pickupAddress?.fullAddress}
                  createdAt={item?.createdAt}
                  donatedBy={item?.donatedBy?.name}
                  delivered={item?.delivery?.delivered}
                  driver={item?.delivery?.driver}
                  dropDate={item?.delivery?.dropDate}
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
    </>
  );
};

export default DonationHistoryTabScreen;
