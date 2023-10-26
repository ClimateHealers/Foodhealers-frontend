import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import { styles } from "../Components/Styles";
import { allEvents } from "../redux/actions/allEvents";
import { localized } from "../locales/localization";

const VolunteerTabScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [filterName, setFilterName] = useState<string>(`${localized.t("NEW")}`);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [eventData, setEventData]: any = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  useEffect(() => {
    fetchingEventsData();
    sortByDate();
  }, []);

  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const sortByDate = () => {
    const postListFiltered = [...eventData].sort((a: any, b: any) => {
      const dateA = new Date(a?.eventStartDate);
      const dateB = new Date(b?.eventStartDate);

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

  const fetchingEventsData = async () => {
    const response = await dispatch(allEvents({} as any) as any);
    const data = response?.payload?.foodEvents;
    setEventData(data);
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
              {localized.t("APPROVED")}
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
              {localized.t("PENDING")}
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
            {eventTimings}
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
            {name}
          </Text>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "200",
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: h2dp(1),
            }}
          >
            {address}
          </Text>
        </ScrollView>
        <Button
          title={localized.t("DETAILS")}
          onPress={() =>
            navigation.navigate("VolunteerSingleEventDetails", {
              eventDetails: {
                id: id,
                name: name,
                address: address,
                eventStartDate: eventStartDate,
                eventEndDate: eventEndDate,
                lat: lat,
                additionalInfo: additionalInfo,
                long: long,
                eventPhoto: eventPhoto,
                requiredVolunteers: requiredVolunteers,
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
    <>
      <View style={{ flex: 1 }}>
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
          <ScrollView style={{ flex: 1 }}>
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
              keyExtractor={(item: any) => item?.id}
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
    </>
  );
};

export default VolunteerTabScreen;
