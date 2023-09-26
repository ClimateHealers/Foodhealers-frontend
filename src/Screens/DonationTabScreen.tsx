import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
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

const DonationTabScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [donationData, setDonationData] = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const fetchingDonationData = async () => {
    const response = await dispatch(myDonations({} as any) as any);
    setDonationData(response?.payload?.donationList);
  };

  const fetchingallDonationData = async () => {
    const response = await dispatch(allDonations({} as any) as any);
    setDonationData(response?.payload);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(allDonations({} as any) as any)
      .then(() =>
        dispatch(myDonations({} as any) as any)
          .then(() => setLoading(false))
          .catch(() => {
            setLoading(false);
          })
      )
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingDonationData();
    } else if (index === 1) {
      const res = await dispatch(allDonations({} as any) as any);
      const donationsAll = res?.payload?.AllDonations;
      console.log("nckjsdnvjksndkvndk", res?.payload?.AllDonations);
      const verifiedDonations = donationsAll?.filter(
        (event: any) => event?.status === "approved"
      );
      setDonationData(donationsAll);
    }
  };

  const Item = ({ foodItem, status, delivery, createdAt, donatedBy }: any) => (
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
            Approved
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
            Pending
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
            Rejected
          </Text>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            marginLeft: w2dp(3),
            // width: w2dp(46),
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
            // width: w2dp(52),
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
            // width: w2dp(47),
            fontWeight: "200",
            fontSize: 16,
            lineHeight: 20,
            paddingBottom: h2dp(1),
          }}
        >
          {delivery}
        </Text>
        <Text
          style={{
            marginLeft: w2dp(3),
            // width: w2dp(47),
            fontWeight: "200",
            fontSize: 16,
            lineHeight: 20,
            paddingBottom: h2dp(1),
          }}
        >
          {donatedBy}
        </Text>
      </ScrollView>
      <Button
        title={"Details"}
        onPress={() => navigation.navigate("SingleEventDetails")}
        buttonStyle={{
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
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.toggle}>
          <SegmentedControlTab
            values={["My Donations", "All Donations"]}
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
        <ScrollView style={{ flex: 1 }}>
          <FlatList
            data={donationData}
            renderItem={({ item }: any) => (
              <Item
                status={item?.status}
                foodItem={item?.foodItem}
                delivery={item?.delivery?.pickupAddress?.fullAddress}
                createdAt={item?.createdAt}
                donatedBy={item?.donatedBy?.name}
              />
            )}
            keyExtractor={(item: any) => item?.id}
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: h2dp(1),
    backgroundColor: "white",
    marginHorizontal: w2dp(3),
    // height: h2dp(13),
    borderRadius: 5,
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: h2dp(3),
    marginLeft: 15,
  },
  tabStyle: {
    borderColor: "#EDC258",
  },
});

export default DonationTabScreen;
