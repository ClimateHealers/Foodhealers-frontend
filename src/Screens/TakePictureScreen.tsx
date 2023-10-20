import { useNavigation } from "@react-navigation/native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import React, { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, MediaLibrary } from "react-native";

export default function TakePictureScreen() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<any | null>(null);
  const [imageUri, setImageUri] = useState<any | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const navigation: any = useNavigation<string>();

  const setCameraRef = useCallback((ref: any) => {
    cameraRef.current = ref;
  }, []);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef?.current) {
      try {
        const { uri }: CameraCapturedPicture =
          await cameraRef?.current?.takePictureAsync();
        console.log("kndkjancnsdvsm", uri);
        setImageUri(uri);
        MediaLibrary.saveToLibraryAsync(localUri)
        navigation.navigate("DriverPhotoSaveScreen", {
          selectedImage: imageUri,
        });
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={setCameraRef} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
