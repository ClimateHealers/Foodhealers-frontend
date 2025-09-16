import { createAsyncThunk } from "@reduxjs/toolkit";
import { allEvents } from "./allEvents";
import * as Location from "expo-location";

const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const nearbyEvents = createAsyncThunk(
  "events/nearbyEvents",
  async ({ radius = 50 }: { radius?: number }, { dispatch }) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const res = await dispatch(allEvents({} as any) as any);
    const foodEvents = res?.payload?.foodEvents || [];

    const nearby = foodEvents.filter((event: any) => {
      if (!event?.address?.lat || !event?.address?.lng) return false;

      if (event.status !== "approved") return false;

      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        event.address.lat,
        event.address.lng
      );
      return distance <= radius;
    });

    return nearby;
  }
);
