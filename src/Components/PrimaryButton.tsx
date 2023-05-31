import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const PrimaryButton = ({ onPress, title, buttonStyle, titleStyle }: any) => {
  return (
    <Button
      title={title}
      buttonStyle={buttonStyle}
      titleStyle={titleStyle}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyles: {
    backgroundColor: "#5FBB3F",
    color: "black",
    borderRadius: 5,
    width: 190,
    marginBottom: 20,
    marginTop: 40,
  },
  titleStyle: {
    color: "black",
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 35,
  },
});
export default PrimaryButton;
