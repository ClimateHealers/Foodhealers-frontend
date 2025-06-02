import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import {
  heightPercentageToDP as h2dp,
  widthPercentageToDP as w2dp,
} from "react-native-responsive-screen";

const PrimaryButton = ({
  onPress,
  title,
  buttonStyle,
  titleStyle,
  disabled,
}: any) => {
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

export default PrimaryButton;
