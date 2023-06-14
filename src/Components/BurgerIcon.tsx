import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const BurgerIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation: any = useNavigation();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const handleMenuItemPress = (item: any) => {
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
    if (isAuthenticated) {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("SignupScreen");
    }
  };
  const findFoodMenuItemPress = (item: any) => {
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
        <MaterialCommunityIcons
          name="menu"
          size={40}
          color="white"
          onPress={() => toggleMenu()}
        />
        {menuOpen && (
          <View
            style={{
              position: "absolute",
              right: 60,
              top: 65,
              backgroundColor: "white",
              borderColor: "white",
              height: 100,
              borderRadius: 5,
              zIndex:9999

            }}
          >
            <TouchableOpacity onPress={() => handleMenuItemPress("Home")}>
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

    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BurgerIcon;
