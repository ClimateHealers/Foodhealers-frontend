import React, { useEffect } from "react";
import { Button, Text, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LinkingDemo() {
  const handleOpenURL = (event: { url: string }) => {
    // Handle deep linking URL here
    console.log(event.url);
  };

  const handlePress = async (url: string) => {
    const supported = await Linking.canOpenURL("foodhealers://some/path");

    if (supported) {
      // Use deep linking to navigate to another screen in your app
      await Linking.openURL("foodhealers://some/path");
    } else {
      // Use regular linking to navigate to a website or external app
      await Linking.openURL(url);
      // await Linking.openURL('https://www.apple.com');
    }
  };

  useEffect(() => {
    // Add event listener for deep linking
    const subs = Linking.addEventListener("url", handleOpenURL);

    // Remove event listener when component unmounts
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
