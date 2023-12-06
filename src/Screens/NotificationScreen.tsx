import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import {
  notfifications,
  putNotifications,
} from "../redux/actions/notificationAction";

export default function NotificationScreen() {
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(false);
  const [menuClose, setMenuOpen] = useState(false);
  const [notificationData, setNotificationData]: any = useState<[]>([]);
  const [data, setData]: any = useState<[]>([]);
  const [displayData, setDisplayData] = useState(false);
  const [modalData, setModalData]: any = useState<[]>([]);

  const menuItem = "Account";

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchingNotificationsData();
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [menuClose]);

  const dispatch = useDispatch();
  const fetchingNotificationsData = async () => {
    const response = await dispatch(notfifications({} as any) as any);
    setNotificationData(response?.payload?.notifications);
    const postListFiltered = [...response?.payload?.notifications].sort(
      (a: any, b: any) => {
        const dateA = a?.id;
        const dateB = b?.id;
        return dateB - dateA;
      }
    );
    setNotificationData(postListFiltered);
  };

  const modalDisplayData = async (id: any) => {
    const response = notificationData?.filter((event: any) => event.id === id);
    setModalData(response[0]);
  };
  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
  };

  const toggleDisplay = () => {
    setDisplayData(true);
  };

  const Item = ({ title, message, requiredDate, id, is_unread }: any) => (
    <TouchableOpacity
      onPress={async () => {
        modalDisplayData(id);
        toggleDisplay();
      }}
    >
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: is_unread ? "white" : "#D2CDCD",
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginLeft: w2dp(3),
                fontSize: h2dp(1.6),
                paddingTop: h2dp(1.5),
                marginRight: w2dp(3),
              }}
            >
              {moment(requiredDate).format("MMM DD, YYYY  ddd, hh:mm A")}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Ionicons
                style={{ paddingTop: h2dp(0.5), marginRight: w2dp(1) }}
                name="ios-time-outline"
                size={20}
                color="black"
              />
              <Text
                style={{
                  fontSize: h2dp(1.6),
                  paddingTop: h2dp(0.5),
                  marginRight: w2dp(3),
                }}
              >
                {moment(new Date(requiredDate)).fromNow()}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginLeft: w2dp(3),
              fontWeight: "500",
              fontSize: h2dp(1.6),
              lineHeight: 30,
              marginBottom: h2dp(1.5),
            }}
          >
            {title}
          </Text>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#359133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <FoodhealersHeader />
          <View style={styles.root}>
            <Ionicons
              name="chevron-back"
              size={32}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>{"Notifications"}</Text>
            </View>
            <BurgerIcon
              onOutsidePress={handlePressOutside}
              menuClose={menuClose}
              menuItem={menuItem}
            />
          </View>
          <Modal visible={loading} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size={"large"} />
              </View>
            </View>
          </Modal>
          <Modal
            visible={displayData}
            onRequestClose={() => setDisplayData(false)}
            transparent
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba( 0,0,0,0.1)",
                paddingHorizontal: w2dp(4),
                // overflow: "hidden",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  marginHorizontal: 20,
                  paddingVertical: 20,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: w2dp(3),
                      fontSize: h2dp(1.6),
                      paddingTop: h2dp(1.5),
                      marginRight: w2dp(3),
                    }}
                  >
                    {moment(modalData?.createdAt).format(
                      "MMM DD, YYYY  ddd, hh:mm A"
                    )}
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      style={{ paddingTop: h2dp(1.5), marginRight: w2dp(1) }}
                      name="ios-time-outline"
                      size={20}
                      color="black"
                    />
                    <Text
                      style={{
                        fontSize: h2dp(1.6),
                        paddingTop: h2dp(1.5),
                        marginRight: w2dp(3),
                      }}
                    >
                      {moment(new Date(modalData?.createdAt)).fromNow()}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginLeft: w2dp(3),
                    fontWeight: "500",
                    fontSize: h2dp(1.6),
                    lineHeight: 30,
                  }}
                >
                  {modalData?.title}
                </Text>
                <Text
                  style={{
                    marginLeft: w2dp(3),
                    fontWeight: "300",
                    fontSize: h2dp(1.6),
                    lineHeight: 20,
                    paddingBottom: h2dp(1),
                    marginRight: w2dp(3),
                  }}
                >
                  {modalData?.message}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: h2dp(1.5),
                  }}
                >
                  <Button
                    title={localized.t("CANCEL")}
                    type="solid"
                    buttonStyle={{
                      backgroundColor: "green",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                    titleStyle={{
                      fontSize: h2dp(2),
                    }}
                    onPress={() => {
                      setDisplayData(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {notificationData?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={notificationData}
              renderItem={({ item }: any) => (
                <Item
                  title={item.title}
                  message={item?.message}
                  requiredDate={item?.createdAt}
                  id={item?.id}
                  is_unread={item?.is_unread}
                />
              )}
            />
          ) : (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: h2dp(35),
                marginBottom: h2dp(10),
              }}
            >
              <Text style={styles.itemText}>
                {localized.t("NOTHING_TO_SHOW")}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
