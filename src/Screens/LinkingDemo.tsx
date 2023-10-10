import React, { useEffect } from "react";
import { Button, Text, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LinkingDemo() {
  const handleOpenURL = (event: { url: string }) => {
    console.log(event.url);
  };

  const handlePress = async (url: string) => {
    const supported = await Linking.canOpenURL("foodhealers://some/path");

    if (supported) {
      await Linking.openURL("foodhealers://some/path");
    } else {
      await Linking.openURL(url);
      // await Linking.openURL('https://www.apple.com');
    }
  };

  useEffect(() => {
    const subs = Linking.addEventListener("url", handleOpenURL);

    return () => subs.remove();
  }, []);

  return (
    <>
      <SafeAreaView>
        <Text>Hello, Expo app!</Text>
        <Button
          title="click to open apple"
          onPress={() => handlePress("https://www.apple.com")}
        />
        <Button
          title="click to open google"
          onPress={() => handlePress("https://www.google.com")}
        />
      </SafeAreaView>
    </>
  );
}
