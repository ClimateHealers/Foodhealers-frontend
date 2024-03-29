/*
This file will automatically generate app.json config and fetch the variables from .env file
purpose: the .env files variables will be hidden.
we are fetchiing google maps api key for now
*/
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const appConfig = {
  expo: {
    name: "food-healers",
    slug: "food-healers",
    version: "1.3.6",
    orientation: "portrait",

    icon: "./assets/FH-androidLogo.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/CH-Logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    scheme: "foodhealers",
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "alamance",
            project: "foodhealers",
            authToken: "366eb09849244d83a4e18e4c87c486af",
          },
        },
      ],
      appOwnership: "standalone",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.foodhealers.climatehealers",
      infoPlist: {
          NSLocationWhenInUseUsageDescription:
          "FoodHealers app needs your location to show nearby events and best transportation options for the selected event within the app.",
          NSPhotoLibraryUsageDescription:
          "Enable photo library access for the Foodhealers app to effortlessly share and upload relevant photos of your contributions and events",
      },
      useFrameworks: "static",
      config: {
        googleMapsApiKey: process.env.GOOGLE_API_KEY || "",
      },
    },
    android: {
      versionCode: 17,
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY || "",
        },
      },
      package: "com.foodhealers.climatehealers",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-localization",
      "expo-location",
      "expo-image-picker",
      "expo-notifications",
      "expo-build-properties",
    ],
    extra: {
      eas: {
        projectId: process.env.PROJECT_ID || "",
        apikey: process.env.FIREBASE_FCM_API_KEY || process.env.PROJECT_ID,
      },
      googleMapsApiKey: process.env.GOOGLE_API_KEY || "",
    },
    owner: "food-healers",
  },
};

// Writing the dynamic configuration to app.json
fs.writeFileSync("./app.json", JSON.stringify(appConfig, null, 2)); // 2 here indicates spaces indentation
