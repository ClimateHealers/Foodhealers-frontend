import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";
import { localized } from "../locales/localization";
import Carousel, { Pagination } from "react-native-snap-carousel";

const AllVolunteersScreen = ({ route }: any) => {
  const { title, itemTypeId, eventId, eventVolunteersData } = route?.params;
  const [loading, setLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const [menuClose, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { width: screenWidth } = Dimensions.get("window");
  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(!menuClose);
  };
  const sliderRef: any = useRef(null);
  const navigation: any = useNavigation();
  const renderItem = ({ item }: any) => {
    return (
      <View>
        <TouchableOpacity activeOpacity={1}>
          <View style={{ width: w2dp(90), alignSelf: "center" }}>
            <TextInput
              placeholder={
                item?.volunteer?.name
                  ? item?.volunteer?.name
                  : `${localized.t("VOLUNTEER_NAME")}`
              }
              placeholderTextColor={"black"}
              style={[styles.textInput, { marginBottom: h2dp(2) }]}
              editable={false}
            />
            <TextInput
              placeholder={
                item?.volunteer?.address?.fullAddress
                  ? item?.volunteer?.address?.fullAddress
                  : `${localized.t("ADDRESS")}`
              }
              placeholderTextColor={"black"}
              style={[styles.textInput, { marginBottom: h2dp(2) }]}
              editable={false}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: h2dp(2),
              }}
            >
              <TextInput
                placeholder={
                  item?.volunteer?.address?.city
                    ? item?.volunteer?.address?.city
                    : `${localized.t("CITY")}`
                }
                placeholderTextColor={"black"}
                style={[styles.textInput, { width: w2dp(43) }]}
                editable={false}
              />
              <TextInput
                placeholder={
                  item?.volunteer?.address?.state
                    ? item?.volunteer?.address?.state
                    : `${localized.t("STATE")}`
                }
                placeholderTextColor={"black"}
                style={[styles.textInput, { width: w2dp(43) }]}
                editable={false}
              />
            </View>
            <View>
              <TextInput
                placeholder={
                  item?.volunteer?.address?.postalCode
                    ? item?.volunteer?.address?.postalCode
                    : `${localized.t("ZIP_CODE")}`
                }
                placeholderTextColor={"black"}
                editable={false}
                style={[styles.textInput, { marginBottom: h2dp(2) }]}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: h2dp(2),
              }}
            >
              <View
                style={[
                  styles.textInput,
                  {
                    width: w2dp(43),
                    paddingVertical: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {localized.t("START_DATE")}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {moment(item?.fromDate).format("MMM, DD, YYYY")}
                </Text>
              </View>
              <View
                style={[
                  styles.textInput,
                  {
                    width: w2dp(43),
                    paddingVertical: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    width: w2dp(43),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {localized.t("START_TIME")}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {moment(item?.fromDate).format("hh:mm A")}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: h2dp(2),
              }}
            >
              <View
                style={[
                  styles.textInput,
                  {
                    width: w2dp(43),
                    paddingVertical: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    width: w2dp(43),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {localized.t("END_DATE")}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {moment(item?.toDate).format("MMM DD, YYYY")}
                </Text>
              </View>
              <View
                style={[
                  styles.textInput,
                  {
                    width: w2dp(43),
                    paddingVertical: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    width: w2dp(43),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {localized.t("END_TIME")}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: h2dp(1.3),
                    marginBottom: 5,
                    marginLeft: 15,
                  }}
                >
                  {moment(item?.toDate).format("hh:mm A")}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder={
                  item?.volunteer?.phoneNumber
                    ? item?.volunteer?.phoneNumber
                    : `${localized.t("PHONE_NUMBER")} : N/A`
                }
                style={[
                  styles.textInput,
                  {
                    width: "100%",
                    alignContent: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                  },
                ]}
                editable={false}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <LinearGradient
        colors={["#86ce84", "#75c576", "#439133", "#0b550a", "#083f06"]}
        style={styles.background}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="auto" />
            <View style={styles.container}>
              <FoodhealersHeader />
              <View style={styles.root}>
                <Ionicons
                  name="chevron-back"
                  size={43}
                  color="white"
                  onPress={() => {navigation.goBack(),handlePressOutside()}}
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{title}</Text>
                </View>
                <BurgerIcon
                  onOutsidePress={handlePressOutside}
                  menuClose={menuClose}
                />
              </View>
              <Modal visible={loading} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ActivityIndicator size={"large"} />
                  </View>
                </View>
              </Modal>
              <View style={{ marginHorizontal: "-4%" }}>
                <Carousel
                  ref={sliderRef}
                  data={eventVolunteersData}
                  renderItem={renderItem}
                  sliderWidth={screenWidth}
                  sliderHeight={screenWidth}
                  itemWidth={screenWidth}
                  layout={"default"}
                  inactiveSlideScale={0.8}
                  inactiveSlideOpacity={0.8}
                  firstItem={0}
                  loopClonesPerSide={2}
                  onSnapToItem={(index) => setActiveSlide(index)}
                  pagingEnabled={true}
                />
                <Pagination
                  dotsLength={eventVolunteersData?.length}
                  activeDotIndex={activeSlide}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#CDDE85",
                  }}
                  inactiveDotStyle={{
                    backgroundColor: "#CDDE85",
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default AllVolunteersScreen;
