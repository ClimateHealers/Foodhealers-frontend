import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import { styles } from "../Components/Styles";
import { allEvents } from "../redux/actions/allEvents";

const VolunteerTabScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [eventData, setEventData] = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  useEffect(() => {
    fetchingEventsData();
  }, []);

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
          {eventTimings}
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
          {name}
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
          {address}
        </Text>
      </ScrollView>
      <Button
        title={"Details"}
        onPress={() =>
          navigation.navigate("VolunteerSingleEventDetails", {
            eventDetails: {
              id: id,
              name: name,
              address: address,
              eventStartDate: eventStartDate,
              eventEndDate: eventEndDate,
              lat: lat,
              long: long,
              eventPhoto: eventPhoto,
              requiredVolunteers: requiredVolunteers,
            },
          })
        }
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
      <View style={{ flex: 1 , marginTop: h2dp(1.5)}}>
        <ScrollView style={{ flex: 1 }}>
          <FlatList
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
      </View>
    </>
  );
};

export default VolunteerTabScreen;
