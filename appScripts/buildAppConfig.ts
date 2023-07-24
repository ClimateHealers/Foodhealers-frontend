
/*
This file will automatically generate app.json config and fetch the variables from .env file
purpose: the .env files variables will be hidden.
we are fetchiing google maps api key for now
*/ 
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();


const appConfig = {
  "expo": {
    "name": "food-healers",
    "slug": "food-healers",
    "version": "1.1.6",
    "orientation": "portrait",
    
    "icon": "./assets/FH-logo.jpg",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "scheme": "foodhealers",
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "alamance",
            "project": "foodhealers",
            "authToken": "366eb09849244d83a4e18e4c87c486af"
          }
        }
      ],
      "appOwnership": "standalone"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.foodhealers.climatehealers",
      "config": {
        "googleMapsApiKey": process.env.GOOGLE_API_KEY || ""
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/Climate-Healers-Logo.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.RECORD_AUDIO"
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_API_KEY || ""
        }
      },
      "package": "com.foodhealers.climatehealers"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-localization",
      "expo-location",
      "expo-image-picker",
      "expo-notifications"
    ],
    "extra": {
      "eas": {
        "projectId":"e0f0f8a7-ffa0-4792-8f06-fc991a1d09fc",
      },
      "googleMapsApiKey" : process.env.GOOGLE_API_KEY || ""
    },
    "owner": "food-healers"
  }
};

// Writing the dynamic configuration to app.json
fs.writeFileSync('./app.json', JSON.stringify(appConfig, null, 2)); // 2 here indicates spaces indentation
