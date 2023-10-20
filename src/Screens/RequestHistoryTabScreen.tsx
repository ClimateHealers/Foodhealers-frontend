import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import ReactNativeSegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { myRequests } from "../redux/actions/myRequests";

const RequestHistoryTabScreen = ({ route }: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [requestData, setRequestData]: any = useState<[]>([]);
  useEffect(() => {
    fetchingRequestData();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...requestData].sort((a: any, b: any) => {
      const dateA = new Date(a?.createdAt);
      const dateB = new Date(b?.createdAt);

      if (order === "ASC") {
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setRequestData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const dispatch = useDispatch();
  const fetchingRequestData = async () => {
    const response = await dispatch(myRequests(1 as any) as any);
    const filteredrequestData = response?.payload?.requestList.filter(
      (event: any) => event?.type === "Food"
    );
    setRequestData(filteredrequestData);
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingRequestData();
    } else if (index === 1) {
      const response = await dispatch(myRequests(2 as any) as any);
      const filteredrequestData = response?.payload?.requestList.filter(
        (event: any) => event?.type === "Supplies"
      );
      const ApprovedDonation = filteredrequestData.filter(
        (event: any) => event?.status === "approved"
      );
      setRequestData(ApprovedDonation);
    }
  };

  const Item = ({ foodItem, status, delivery, requiredDate, type }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        {status === "approved" ? (
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
    <View style={{ flex: 1 }}>
      <View style={styles.toggle}>
        <ReactNativeSegmentedControlTab
          values={[`${localized.t("FOOD")}`, `${localized.t("SUPPLIES")}`]}
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
      <View>
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
            <MaterialIcons
              name="filter-list-alt"
              style={styles.itemFilterText}
            />
          </TouchableOpacity>
        </View>
        {requestData?.length > 0 ? (
          <ScrollView style={{ flex: 1 }}>
            <FlatList
              data={requestData}
              renderItem={({ item }: any) => (
                <Item
                  status={item?.status}
                  type={item?.type}
                  id={item.id}
                  foodItem={`${item?.foodItem}  (${item?.quantity})`}
                  delivery={item?.createdBy?.address?.fullAddress}
                  requiredDate={item?.requiredDate}
                />
              )}
            />
          </ScrollView>
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
    </View>
  );
};

export default RequestHistoryTabScreen;
