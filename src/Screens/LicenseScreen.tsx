import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import BurgerIcon from "../Components/BurgerIcon";
import FoodhealersHeader from "../Components/FoodhealersHeader";
import { styles } from "../Components/Styles";

const LicenseScreen = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [menuClose, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();

  const menuItem = "Account";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const file = require("../../yarn-packages.json");
        const data = typeof file === "string" ? JSON.parse(file) : file;

        const packag: any = data?.data.trees.map((pkg: any) => {
          const packageInfo = pkg.name.split("@");
          const name = packageInfo[0];
          const version = packageInfo[1];
          return { name, version };
        });
        const extractedPackages: any[] = Object.keys(packag).map(
          (packageName: any) => {
            const packageData = packag[packageName] || {};
            return {
              name: packageData?.name,
              version: packageData?.version,
              key: packageName,
            };
          }
        );
        setPackages(extractedPackages);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    fetchPackages();
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
  };

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
              onPress={() => {
                navigation.goBack(), handlePressOutside();
              }}
            />
            <View style={styles.item}>
              <Text style={styles.itemText}>{"Open-Source Packages"}</Text>
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
          {/* <ScrollView showsVerticalScrollIndicator={false}> */}
          <TouchableOpacity activeOpacity={1}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FlatList
                data={packages}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => {
                  return (
                    <View style={{ padding: 10 }}>
                      <Text style={styles.profileDetailsText2}>
                        {" "}
                        {item.name} {item.version}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default LicenseScreen;
