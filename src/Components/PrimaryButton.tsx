import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";

const PrimaryButton = ({ onPress, title, buttonStyle, titleStyle, disabled }: any) => {
  return (
    <Button
      title={title}
      buttonStyle={buttonStyle}
      titleStyle={titleStyle}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyles: {
    color: "black",
    borderRadius: 5,
    width: 190,
    marginBottom: 20,
    marginTop: 40,
  },
  titleStyle: {
    color: "black",
    fontSize: h2dp(2.6),
    fontWeight: "400",
    lineHeight: 35,
  },
});
export default PrimaryButton;
