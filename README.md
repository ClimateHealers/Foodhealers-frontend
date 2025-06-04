
# Food Healers App

A mobile app built with **Expo** and **React Native** to promote **vegan food donations** and improve community outreach.

## 🌱 About the App

Food Healers is a community-driven initiative aimed at making healthy, plant-based food accessible to everyone. This app enables individuals and organizations to donate or find vegan food with ease.

### Key Capabilities:

- 🥗 **Find vegan food and recipes**
- 📍 **Vegan food donation form with Google Places integration**
- 📦 **Request food and supply support**
- 🎁 **Donate food and essential supplies**
- 📅 **Post and discover community events**
- 🚗 **Become a volunteer driver for food deliveries**

## 🚀 Features

- 🔔 **Push notifications for new events and donations**
- 📱 **Responsive design for both iOS and Android**
- ⚙️ **Expo EAS Build support for easy deployment**

## 🛠 Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **Formik** for forms
- **Google Places API**
- **EAS Build** for app deployment

## 🧩 Environment & Version Info

- **Node.js:** 10.x
- **npm:** 10.x
- **Expo SDK:** 52
- **React Native:** Compatible with Expo SDK 52
- **Android Minimum Version:** 11.0 (API 30)
- **iOS Minimum Version:** 12.0

### 📄 .env file

Create a `.env` file at the root with the following:

```env
GOOGLE_MAPS_API_KEY=your_google_api_key
FIREBASE_FCM_API_KEY=your_firebase_fcm_key
```

## 📦 Getting Started

### Installation

```bash
git clone https://github.com/ClimateHealers/Foodhealers-frontend
cd food-healers
npm install
# or
yarn install
```

### Run the App (Development)

```bash
npx expo start
```

## 🧪 Build Instructions

### 🔍 Debug APK (Android)

```bash
eas build -p android --profile preview
```
- This will generate a debug `.apk` file.

### 🚀 Release Build

```bash
- command to build IOS build in TestFlight using expo 
`eas build -p ios`
- command to submit IOS build on TestFlight using expo loN
`eas submit --platform ios`
- command to release APK for android
- `eas build -p android --profile preview`
```

- The release build will be signed and ready for publishing to the Play Store or App Store.
