import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FlipType, SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

export default function TakePictureScreen() {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) return;

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();
      const adjusted = await manipulateAsync(
        photo.uri,
        facing === "front" ? [{ flip: FlipType.Horizontal }] : [],
        { compress: 1, format: SaveFormat.JPEG }
      );
      await MediaLibrary.saveToLibraryAsync(adjusted.uri);
      navigation.navigate("DriverPhotoSaveScreen", {
        selectedImage: adjusted.uri,
        fromCameraRoll: false,
      });
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to access the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={loading} transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      </Modal>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
        onMountError={(err) => console.error("Camera error", err)}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleCamera}>
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} disabled={!isCameraReady}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 40,
    borderRadius: 20,
  },
});