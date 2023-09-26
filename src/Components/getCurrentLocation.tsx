import axios from "axios";

export const getLocation = async () => {
  try {
    const response = await axios.get("http://ipinfo.io/json");
    const { loc } = response.data;
    console.log("cheking location from IP address", loc);
    const [latitude, longitude] = loc
      .split(",")
      .map((coord: any) => parseFloat(coord));
    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching user location", error);
    return null;
  }
};
