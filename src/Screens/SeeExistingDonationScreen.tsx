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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { getLocation } from "../Components/getCurrentLocation";
import { localized } from "../locales/localization";
import { myDonations } from "../redux/actions/myDonations";
import { Modal } from "react-native-paper";
import { Button } from "react-native-elements";
import PrimaryButton from "../Components/PrimaryButton";
import { myRequests } from "../redux/actions/myRequests";
import { allRequests } from "../redux/actions/allRequests";

const SeeExistingDonationScreen = ({ route }: any) => {
  const { itemTypeId, title, latitude, longitude } = route?.params;
  const [showDialog, setShowDialog] = useState<boolean>(true);
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
    const response = await dispatch(allRequests({itemTypeId} as any) as any);
    if (itemTypeId === 1) {
      const filteredrequestData = response?.payload?.AllRequests.filter(
        (event: any) => event?.type === "Food"
      );
      setRequestData(filteredrequestData);
    } else if (itemTypeId === 2) {
      const filteredrequestData = response?.payload?.AllRequests.filter(
        (event: any) => event?.type === "Supplies"
      );
      setRequestData(filteredrequestData);
    } else {
      setRequestData(response?.payload?.AllRequests);
    }
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const Item = ({
    foodItem,
    status,
    delivery,
    requiredDate,
    type,
    phoneNumber,
  }: any) => (
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
            {type === "Supplies" ? (
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
            {type === "Supplies" ? (
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

          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "300",
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: h2dp(1),
            }}
          >
            {phoneNumber}
          </Text>
        </ScrollView>
        <Button
          title="Donate"
          onPress={() =>
            navigation.navigate("SingleEventDetails", {
              eventDetails: {
                // additionalInfo: additionalInfo,
                // itemTypeId: itemTypeId,
                // title: title,
                // id: id,
                // name: name,
                // address: address,
                // eventStartDate: eventStartDate,
                // eventEndDate: eventEndDate,
                // lat: lat,
                // long: long,
                // eventPhoto: eventPhoto,
                // requiredVolunteers: requiredVolunteers,
                latitude: latitude,
                longitude: longitude,
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
              onPress={() => navigation.goBack()}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>{localized.t("EXISTING_FOOD_REQUESTS")}</Text>
            </View>
            <BurgerIcon />
          </View>

          <View>
            <View style={styles.itemFilter}>
              <Text style={styles.itemFilterText}>{localized.t("EXISTING_FOOD_REQUESTS")}</Text>
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
                <MaterialIcons
                  name="filter-list-alt"
                  style={styles.itemFilterText}
                />
              </TouchableOpacity>
            </View>
            <View style={{height:h2dp(70), marginTop: h2dp(1)}}>
              <FlatList
                data={requestData}
                renderItem={({ item }: any) => (
                  <Item
                    status={item?.status}
                    type={item?.type}
                    id={item.id}
                    foodItem={`${item?.foodItem}  (${item?.quantity})`}
                    delivery={item?.delivery?.pickupAddress?.fullAddress}
                    requiredDate={item?.requiredDate}
                  />
                )}
              />
            </View>
          </View>
          <PrimaryButton
            title={localized.t("DONATE_FOOD")}
            onPress={() =>
              navigation.navigate("AddDonationsScreen", {
                itemTypeId: itemTypeId,
                title: title,
                latitude: latitude,
                longitude: longitude,
              })
            }
            buttonStyle={{
              backgroundColor: "#FC5A56",
              color: "black",
              borderRadius: 5,
              width: w2dp(70),
              alignSelf: "center",
              marginTop: h2dp(3),
            }}
            titleStyle={styles.titleStyle}
          />
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SeeExistingDonationScreen;
