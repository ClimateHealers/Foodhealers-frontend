import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
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
import ReactNativeSegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { myRequests } from "../redux/actions/myRequests";
import { useFocusEffect } from "@react-navigation/native";

const RequestHistoryTabScreen = ({ route }: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [requestData, setRequestData]: any[] = useState<[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemTypeId, setItemTypeId] = useState<number>(1);
  useFocusEffect(
    useCallback(() => {
      fetchingRequestData();
      sortByDate();
    }, [selectedIndex])
  );

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...requestData].sort((a: any, b: any) => {
      const dateA = new Date(a?.createdAt);
      const dateB = new Date(b?.createdAt);

      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        setFilterName(`${localized.t("NEW")}`);
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
    const ApprovedDonation = response?.payload?.requestList?.filter(
      (event: any) => event?.type === "Food"
    );
    setRequestData(ApprovedDonation);
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      setItemTypeId(1);
      fetchingRequestData();
    } else if (index === 1) {
      setLoading(true);
      setItemTypeId(2);
      const response = await dispatch(myRequests({ itemTypeId } as any) as any);
      const ApprovedDonation = response?.payload?.requestList?.filter(
        (event: any) => event?.type === "Supplies"
      );
      setRequestData(ApprovedDonation);
      setLoading(false);
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
        <Text style={styles.itemFilterText}>{localized.t("ALL_HISTORY")}</Text>
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
          <MaterialIcons name="filter-list-alt" style={styles.itemFilterText} />
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
          <Text style={styles.itemText}>{localized.t("NOTHING_TO_SHOW")}</Text>
        </View>
      )}
    </View>
  );
};

export default RequestHistoryTabScreen;
