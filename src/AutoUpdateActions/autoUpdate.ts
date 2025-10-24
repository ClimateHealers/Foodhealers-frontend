import { Alert, AppState, Platform } from "react-native";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as Application from "expo-application";

// Android in-app updates
let SpInAppUpdates: any;
let IAUUpdateKind: any;

if (Platform.OS === "android") {
  try {
    const module = require("sp-react-native-in-app-updates");
    SpInAppUpdates = module.default;
    IAUUpdateKind = module.IAUUpdateKind;
  } catch (e) {
    console.log("sp-react-native-in-app-updates not available in Expo Go.");
  }
}

// OTA update for both Android & iOS

async function handleOTAUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      console.log("OTA update available — downloading...");
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // reload immediately after download
    } else {
      console.log("App is up to date (OTA).");
    }
  } catch (error) {
    console.log("OTA update failed:", error);
  }
}

// Play Store auto-update (Android standalone only)

async function handlePlayStoreUpdate() {
  if (Platform.OS !== "android" || !SpInAppUpdates) return;

  try {
    const inAppUpdates = new SpInAppUpdates(false);
    const result = await inAppUpdates.checkNeedsUpdate();

    if (result.shouldUpdate) {
      console.log("⬇️ Play Store update available — auto installing...");
      await inAppUpdates.startUpdate({
        updateType: IAUUpdateKind.IMMEDIATE,
      });
    } else {
      console.log("App is up to date (Play Store).");
    }
  } catch (error) {
    console.log("Play Store update failed:", error);
  }
}

// App Store update popup (iOS)

async function handleAppStoreUpdate() {
  if (Platform.OS !== "ios") return;

  try {
    const bundleId = Application.applicationId;
    const response = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${bundleId}`
    );
    const data = await response.json();

    if (data?.results?.length > 0) {
      const storeVersion = data.results[0]?.version;
      const trackId = data.results[0]?.trackId;
      const currentVersion = Constants?.expoConfig?.version;

      const normalizeVersion = (version: any) =>
        version.split(".").map((num: any) => parseInt(num, 10));

      const isStoreVersionHigher = (store: any, current: any) => {
        const storeVersion = normalizeVersion(store);
        const currentVersion = normalizeVersion(current);
        for (
          let i = 0;
          i < Math.max(storeVersion.length, currentVersion.length);
          i++
        ) {
          const sv = storeVersion[i] || 0;
          const cv = currentVersion[i] || 0;
          if (sv > cv) return true;
          if (sv < cv) return false;
        }
        return false;
      };

      if (
        storeVersion &&
        isStoreVersionHigher(storeVersion, currentVersion) &&
        trackId
      ) {
        Alert.alert(
          "Update Available",
          `A new version is available. Please update to continue.`,
          [
            {
              text: "Update Now",
              onPress: () => {
                Linking.openURL(
                  `itms-apps://itunes.apple.com/app/id${trackId}`
                );
              },
            },
            { text: "Later", style: "cancel" },
          ],
          { cancelable: true }
        );
      }
    }
  } catch (error) {
    console.log("App Store update check failed:", error);
  }
}

// Unified auto-update: OTA + Play Store + App Store

export async function checkAndApplyAutoUpdate() {
  // OTA update first (both platforms)
  await handleOTAUpdate();

  // Platform-specific updates
  await handlePlayStoreUpdate();
  await handleAppStoreUpdate();
}

// Initialize auto-update listener

export function initAutoUpdateListener() {
  if (__DEV__) return;

  const safeUpdate = async () => {
    try {
      await checkAndApplyAutoUpdate();
    } catch (e) {
      console.log("Auto update error:", e);
    }
  };

  // Run on app start
  safeUpdate();

  // Run when app comes to foreground
  const sub = AppState.addEventListener("change", (state) => {
    if (state === "active") safeUpdate();
  });

  return () => sub.remove();
}
