import { AntDesign, Entypo, FontAwesome ,Feather} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Button } from "react-native-elements";
import {
    heightPercentageToDP as h2dp, widthPercentageToDP as w2dp
} from "react-native-responsive-screen";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import { getLocation } from "../Components/getCurrentLocation";
import { allEvents } from "../redux/actions/allEvents";
import { myEvents } from "../redux/actions/myEvents";

const AllEventScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [eventData, setEventData] = useState<[]>([]);



  const dispatch = useDispatch();

  const navigation: any = useNavigation();

  const handleMenuItemPress = (item: any) => {
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    navigation.navigate("HomeScreen");
  };
  const findFoodMenuItemPress = (item: any) => {
    getLocation().then((res) => {
      if(res){
        navigation?.navigate("MapScreen", {
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
      }
    });
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
  };

  //disptaching  my event
  const fetchingEventData = async () => {
    const response = await dispatch(myEvents({}) as any);
    console.log(
      "checking repsonse from my events api",
      response?.payload?.foodEvents
    );
    setEventData(response?.payload?.foodEvents);
  };

  useEffect(() => {
    fetchingEventData();
  }, []);

  //handling segmented tab

  const handleSingleIndexSelect = async (index: any) => {
    setSelectedIndex(index);
    if (index === 0) {
      fetchingEventData();
    } else if (index === 1) {
      const res = await dispatch(allEvents({}) as any);
      const foodEvents = res?.payload?.foodEvents;
      const verifiedFoodEvents = foodEvents?.filter(
        (event: any) => event.status === "approved"
      );

      console.log("checking response from all events API", verifiedFoodEvents);
      setEventData(verifiedFoodEvents);
    }
  };


  const Item = ({
    additionalInfo,
    address,
    eventStartDate,
    eventEndDate,
    lat,
    long,
    verified,
    status,
    eventPhoto,
    name
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
            marginTop:h2dp(1.5)
          }}
        />
          <Text style={{ marginLeft: h2dp(1.5),fontSize:11,color:"green", marginTop:h2dp(0.5)}}>Approved</Text>
        </View>
      ) : status === "pending" ? (
        <View>
          <FontAwesome
          name="clock-o"
          size={24}
          color="#f2db0a"
          style={{
            marginLeft: h2dp(2.3),
            marginTop:h2dp(1.5)
          }}
        />
        <Text style={{ marginLeft: h2dp(1.5),fontSize:11,color:"#f2db0a",marginTop:h2dp(0.5)}}>Pending</Text>
          </View>
      ) : (
        <View>
          <Feather name="x-circle" size={24} color="red"  style={{marginLeft: h2dp(2.3),
            marginTop:h2dp(1.5)}}/>
          {/* <Entypo name="circle-with-cross" size={25} color="red"  style={{
          marginLeft: h2dp(2.5)
        }} /> */}
        <Text style={{ marginLeft: h2dp(1.5),fontSize:11,color:"red",marginTop:h2dp(0.5)}}>Rejected</Text>
          </View>
      )}
      <ScrollView
      showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            marginLeft: w2dp(5),
            width: w2dp(52),
            fontWeight: "500",
            fontSize: 16,
            lineHeight:30,
            paddingTop:h2dp(1)
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            marginLeft: w2dp(5),
            width: w2dp(47),
            fontWeight: "200",
            fontSize: 16,
            lineHeight:20,
            paddingBottom:h2dp(1)
          }}
        >
          {address}
        </Text>
      </ScrollView>
      <Button
        title={"Details"}
        onPress={() =>
          navigation.navigate("SingleEventDetails", {
            eventDetails: {
              additionalInfo: additionalInfo,
              address: address,
              eventStartDate: eventStartDate,
              eventEndDate: eventEndDate,
              lat: lat,
              long: long,
              eventPhoto: eventPhoto,
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
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Text style={styles.itemText}>{"See All Events"}</Text>
              <View style={styles.item}>
                <BurgerIcon />
                {menuOpen && (
                  <View
                    style={{
                      position: "absolute",
                      right: 60,
                      top: 70,
                      backgroundColor: "white",
                      borderColor: "white",
                      height: 100,
                      borderRadius: 5,
                      zIndex: 9999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMenuItemPress("Home")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => findFoodMenuItemPress("Find Food")}
                    >
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 20,
                          fontWeight: "300",
                          lineHeight: 27.24,
                        }}
                      >
                        Find Food
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.toggle}>
              <SegmentedControlTab
                values={["My Events", "All Events"]}
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
            <ScrollView style={{ flex: 1 }}>
              <FlatList
                data={eventData}
                renderItem={({ item }:any) => (
                  <Item
                    additionalInfo={item?.additionalInfo}
                    name={item?.name}
                    address={item?.address?.fullAddress}
                    lat={item.address?.lat}
                    long={item.address?.lng}
                    eventStartDate={item?.eventStartDate}
                    eventEndDate={item?.eventEndDate}
                    verified={item?.verified}
                    status={item?.status}
                    eventPhoto = {item?.eventPhoto}
                  />
                )}
                keyExtractor={(item:any) => item?.id}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // alignItems: "center",
    width: "100%",
    zIndex:100
  },
  item: {
    width: "30%",
    marginTop: 25,
    marginLeft: 30,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 25,
    color: "white",
    alignSelf: "center",
    justifSelf: "center",
    marginTop: h2dp(3),
  },
  newItem: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: h2dp(1),
    backgroundColor: "white",
    marginHorizontal: w2dp(3),
    height: h2dp(13),
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

export default AllEventScreen;
