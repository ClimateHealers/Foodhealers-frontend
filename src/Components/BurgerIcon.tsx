import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/reducers/authreducers";
import { getLocation } from "./getCurrentLocation";

const BurgerIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation: any = useNavigation();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.data.isAuthenticated
  );

  const dispatch = useDispatch()
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
    getLocation().then((location: any) => {
      navigation.navigate("MapScreen", {
        location: location,
      });
    });
    // console.log(`Selected menu item: ${item}`);
    setMenuOpen(false);
  };
  const logout = async (item: any) => {
    // persistor.purge()
    await dispatch(logOut({}) as any);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
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
            
            borderRadius: 5,
            // zIndex: 9999,
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
          <TouchableOpacity onPress={() => findFoodMenuItemPress("Find Food")}>
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
          {isAuthenticated && (
                      <TouchableOpacity onPress={() => logout("logout")}>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 20,
                            fontWeight: "300",
                            lineHeight: 27.24,
                          }}
                        >
                          Log out
                        </Text>
                      </TouchableOpacity>
                    )}
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
