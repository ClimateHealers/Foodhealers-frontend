import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
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
import { fetchPickup } from "../redux/actions/acceptPickupAction";

const PickupHistoryScreen = ({ route }: any) => {
  const { itemTypeId } = route?.params;
  const [menuClose, setMenuOpen] = useState(false);
  const [pickupData, setPickupData]: any[] = useState<[]>([]);
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const dispatch = useDispatch();

  const fetchingPickedupData = async () => {
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
      (event: any) => event?.fullfilled === true
    );
    setPickupData(fullfilledRequests);
  };

  useEffect(() => {
    fetchingPickedupData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...pickupData].sort((a: any, b: any) => {
      const dateA = new Date(a.eventStartDate);
      const dateB = new Date(b.eventStartDate);

      if (order === "ASC") {
        setFilterName(`${localized.t("NEW")}`);
        return dateA?.valueOf() - dateB?.valueOf();
      } else {
        setFilterName(`${localized.t("OLD")}`);
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
    setMenuOpen(!menuClose);
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
    fullfilled,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        <Text
          style={{
            marginLeft: w2dp(3),
            fontSize: h2dp(1.6),
            lineHeight: 30,
            paddingTop: h2dp(0.5),
            fontWeight: "bold",
          }}
        >
          {pickupTiming}
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
          {pickAddress}
        </Text>
        <Button
          title={localized.t("DETAILS")}
          onPress={() => {
            handlePressOutside();
            active === false
              ? navigation.navigate("PickupConfirmScreen", {
                  pickAddress,
                  pickupTiming,
                  picklat,
                  picklng,
                  droplat,
                  droplng,
                  dropTiming,
                  dropAddress,
                  pickupId: id,
                  active,
                  fullfilled,
                })
              : navigation.navigate("PickupSelectedDetailsScreen", {
                  pickAddress,
                  pickupTiming,
                  picklat,
                  picklng,
                  droplat,
                  droplng,
                  dropTiming,
                  dropAddress,
                  pickupId: id,
                  active,
                  fullfilled,
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
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <StatusBar animated={true} backgroundColor="auto" />
            <FoodhealersHeader />
            <View style={[styles.root]}>
              <Ionicons
                name="chevron-back"
                size={32}
                color="white"
                onPress={() => {
                  navigation.navigate("DriverRequestScreen");
                  handlePressOutside();
                }}
              />
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  {localized.t("PICKUP_HISTORY")}
                </Text>
              </View>
              <BurgerIcon
                onOutsidePress={handlePressOutside}
                menuClose={menuClose}
              />
            </View>
            {pickupData?.length > 0 ? (
              <View style={{ flex: 1 }}>
                <View style={styles.itemFilter}>
                  <Text style={styles.itemFilterText}>
                    {localized.t("PICKUP_HISTORY")}
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
                    <Text style={styles.itemFilterText}>
                      {localized.t("FILTER")}
                    </Text>
                    <Text style={styles.filterNameText}>({filterName})</Text>
                    <MaterialIcons
                      name="filter-list-alt"
                      style={styles.itemFilterText}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={pickupData}
                  renderItem={({ item }: any) => (
                    <Item
                      name={item?.name}
                      pickupTiming={`${moment(item?.deliver?.pickupDate).format(
                        "DD,  ddd, hh:mm A"
                      )}`}
                      pickAddress={item?.deliver?.pickupAddress?.fullAddress}
                      dropAddress={item?.deliver?.dropAddress?.fullAddress}
                      picklat={item?.deliver?.pickupAddress?.lat}
                      picklng={item?.deliver?.pickupAddress?.lng}
                      eventStartDate={item?.eventStartDate}
                      eventEndDate={item?.eventEndDate}
                      id={item?.id}
                      status={item?.status}
                      droplat={item?.deliver?.dropAddress?.lat}
                      droplng={item?.deliver?.dropAddress?.lng}
                      dropTiming={`${moment(item?.deliver?.dropDate).format(
                        "DD,  ddd, hh:mm A"
                      )}`}
                      active={item?.active}
                      fullfilled={item?.fullfilled}
                    />
                  )}
                  keyExtractor={(item): any => item?.id.toString()}
                />
              </View>
            ) : (
              <View style={[styles.centeredView, { flex: 1 }]}>
                <Text style={{ color: "white" }}>
                  {localized.t("NOTHING_TO_SHOW")}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default PickupHistoryScreen;
