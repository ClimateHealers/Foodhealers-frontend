import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Image } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";
import { allRequests } from "../redux/actions/allRequests";
import { fetchPickup } from "../redux/actions/acceptPickupAction";
import ReactNativeSegmentedControlTab from "react-native-segmented-control-tab";
import { fetchUser } from "../redux/actions/authAction";

const PickupDetailsScreen = ({ route }: any) => {
  const { itemTypeId } = route?.params;
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<any>();
  const [pickupData, setPickupData]: any[] = useState<[]>([]);
  const dispatch = useDispatch();

  const fetchingPickedupData = async () => {
    setLoading(true);
    const response = await dispatch(
      fetchPickup({ requestTypeId: itemTypeId } as any) as any
    );
    const data = response?.payload?.PickupRequests;
    const requiredVolunteers = data?.filter(
      (event: any) => event?.type === "Pickup"
    );
    const verifiedFoodEvents = requiredVolunteers?.filter(
      (event: any) => event?.active === false
    );
    const fullfilledRequests = verifiedFoodEvents?.filter(
      (event: any) => event?.fullfilled === false
    );
    setPickupData(fullfilledRequests);
    setLoading(false);
  };

  const delivery = data?.address?.city;

  const fetchingUserData = async () => {
    const response = await dispatch(fetchUser({} as any) as any);
    const data = response?.payload?.userDetails;
    setData(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchingPickedupData();
      sortByDate();
      fetchingUserData();
    }, [])
  );

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...pickupData].sort((a: any, b: any) => {
      const dateA = new Date(a.eventStartDate);
      const dateB = new Date(b.eventStartDate);

      if (order === "ASC") {
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        return dateB?.valueOf() - dateA?.valueOf();
      }
    });
    setPickupData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingPickedupData();
    } else if (index === 1) {
      setLoading(true);
      const response = await dispatch(
        allRequests({ itemTypeId } as any) as any
      );
      const data = response?.payload?.AllRequests;
      const requiredVolunteers = data?.filter(
        (event: any) => event?.type === "Pickup"
      );
      const verifiedFoodEvents = requiredVolunteers?.filter(
        (event: any) => event?.active === true
      );
      const pickupLocationAround = verifiedFoodEvents?.filter(
        (event: any) => event?.deliver?.pickupAddress?.city === delivery
      );
      setPickupData(pickupLocationAround);
      setLoading(false);
    }
  };

  const Item = ({
    pickAddress,
    pickupTiming,
    picklat,
    picklng,
    droplat,
    droplng,
    dropTiming,
    dropAddress,
    id,
    active,
    pickedup,
    delivered,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontSize: 16,
              lineHeight: 30,
              paddingTop: h2dp(0.5),
              fontWeight: "500",
            }}
          >
            {pickupTiming}
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
            {pickAddress}
          </Text>
        </ScrollView>
        <Button
          title={localized.t("DETAILS")}
          onPress={() => {
            active === false
              ? navigation.navigate("PickupConfirmScreen", {
                  pickAddress: pickAddress,
                  pickupTiming: pickupTiming,
                  picklat: picklat,
                  picklng: picklng,
                  droplat: droplat,
                  droplng: droplng,
                  dropTiming: dropTiming,
                  dropAddress: dropAddress,
                  pickupId: id,
                  active: active,
                  pickedup: pickedup,
                  delivered: delivered,
                })
              : navigation.navigate("PickupSelectedDetailsScreen", {
                  pickAddress: pickAddress,
                  pickupTiming: pickupTiming,
                  picklat: picklat,
                  picklng: picklng,
                  droplat: droplat,
                  droplng: droplng,
                  dropTiming: dropTiming,
                  dropAddress: dropAddress,
                  pickupId: id,
                  active: active,
                  pickedup: pickedup,
                  delivered: delivered,
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
            fontWeight: "300",
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#6fa200", "#72a400", "#82b200", "#87b500", "#6fa200"]}
        style={styles.background}
      >
        <SafeAreaView>
          <TouchableOpacity activeOpacity={1}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <StatusBar animated={true} backgroundColor="auto" />
              <View style={styles.container}>
                <FoodhealersHeader />
                <View style={styles.root}>
                  <Ionicons
                    name="chevron-back"
                    size={32}
                    color="white"
                    onPress={() => navigation.navigate("DriverRequestScreen")}
                  />
                  <View style={styles.item}>
                    <Text style={styles.itemText}>
                      {localized.t("PICKUPS")}
                    </Text>
                  </View>
                  <BurgerIcon />
                </View>
                <Modal
                  visible={loading}
                  animationType="slide"
                  transparent={true}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <ActivityIndicator size={"large"} />
                    </View>
                  </View>
                </Modal>
                <View style={styles.toggle}>
                  <ReactNativeSegmentedControlTab
                    values={[
                      `${localized.t("ONGOING_PICKUPS")}`,
                      `${localized.t("PICKUP_REQUESTS")}`,
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
                {pickupData?.length > 0 ? (
                  <View>
                    <View>
                      <Text
                        style={{
                          fontSize: 26,
                          marginTop: h2dp(3),
                          alignSelf: "center",
                        }}
                      >
                        {localized.t("ACCEPT_A_PICKUP_TODAY")}
                      </Text>
                    </View>
                    <View style={{ marginTop: h2dp(3) }}>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={pickupData}
                        renderItem={({ item }: any) => (
                          <Item
                            name={item?.name}
                            pickupTiming={`${moment(
                              item?.deliver?.pickupDate
                            ).format("DD,  ddd, hh:mm A")}`}
                            pickAddress={
                              item?.deliver?.pickupAddress?.fullAddress
                            }
                            dropAddress={
                              item?.deliver?.dropAddress?.fullAddress
                            }
                            picklat={item?.deliver?.pickupAddress?.lat}
                            picklng={item?.deliver?.pickupAddress?.lng}
                            eventStartDate={item?.eventStartDate}
                            eventEndDate={item?.eventEndDate}
                            id={item?.id}
                            status={item?.status}
                            droplat={item?.deliver?.dropAddress?.lat}
                            droplng={item?.deliver?.dropAddress?.lng}
                            dropTiming={`${moment(
                              item?.deliver?.dropDate
                            ).format("DD,  ddd, hh:mm A")}`}
                            active={item?.active}
                            pickedup={item?.deliver?.pickedup}
                            delivered={item?.deliver?.delivered}
                          />
                        )}
                        keyExtractor={(item): any => {
                          item?.id;
                        }}
                      />
                    </View>
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
            </ScrollView>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default PickupDetailsScreen;
