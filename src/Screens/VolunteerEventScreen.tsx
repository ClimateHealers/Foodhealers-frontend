import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  View
} from "react-native";
import { Button, Image } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import { allEvents } from "../redux/actions/allEvents";

const VolunteerEventScreen = ({ route }: any) => {
  const { itemTypeId, title, latitude, longitude } = route?.params;
  const [eventData, setEventData]: any[] = useState<[]>([]);
  const [menuClose, setMenuOpen] = useState(false);

  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const dispatch = useDispatch();
  const fetchingEventsData = async () => {
    const response = await dispatch(allEvents({} as any) as any);
    const data = response?.payload?.foodEvents;
    const requiredVolunteers = data?.filter(
      (event: any) => event?.requiredVolunteers > 0
    );
    const verifiedFoodEvents = requiredVolunteers?.filter(
      (event: any) => event?.active === true
    );
    setEventData(verifiedFoodEvents);
  };

  useEffect(() => {
    fetchingEventsData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...eventData].sort((a: any, b: any) => {
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
    setEventData(postListFiltered);
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
  };

  const navigation: any = useNavigation();

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };

  const Item = ({
    status,
    address,
    id,
    eventTimings,
    name,
    requiredVolunteers,
    additionalInfo,
    eventStartDate,
    eventEndDate,
    lat,
    long,
    eventPhoto,
  }: any) => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontSize: h2dp(1.6),
              lineHeight: 30,
              paddingTop: h2dp(0.5),
            }}
          >
            {eventTimings}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "500",
              fontSize: h2dp(1.6),
              lineHeight: 30,
            }}
          >
            {name}
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
            {address}
          </Text>
        </ScrollView>
        <Button
          title={localized.t("DETAILS")}
          onPress={() => {
            handlePressOutside(),
            navigation.navigate("SingleEventDetails", {
              eventDetails: {
                additionalInfo: additionalInfo,
                itemTypeId: itemTypeId,
                title: title,
                id: id,
                name: name,
                address: address,
                eventStartDate: eventStartDate,
                eventEndDate: eventEndDate,
                lat: lat,
                long: long,
                eventPhoto: eventPhoto,
                requiredVolunteers: requiredVolunteers,
                latitude: latitude,
                longitude: longitude,
                status: status,
              },
            })
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
                {eventData?.length > 0
                  ? `${localized.t("EVENTS")}`
                  : `${localized.t("POST_AN_EVENT")}`}
              </Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
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
                    name={item?.name}
                    eventTimings={`${moment(item?.eventStartDate).format(
                      "DD,  ddd, hh:mm A"
                    )}`}
                    address={item?.address?.streetAddress}
                    additionalInfo={item?.additionalInfo}
                    lat={item?.address?.lat}
                    long={item?.address?.lng}
                    eventStartDate={item?.eventStartDate}
                    eventEndDate={item?.eventEndDate}
                    id={item?.id}
                    status={item?.status}
                    eventPhoto={item?.eventPhoto}
                    requiredVolunteers={item?.requiredVolunteers}
                  />
                )}
                keyExtractor={(item): any => {
                  item?.id;
                }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => {navigation.navigate("PostEvent"),handlePressOutside()}}>
              <View style={{ marginTop: h2dp(3), alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/shutterShock.png")}
                  style={styles.imageStyle}
                />
                <View style={styles.title}>
                  <Text style={styles.textStyle}>
                    {localized.t("POST_AN_EVENT")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default VolunteerEventScreen;
