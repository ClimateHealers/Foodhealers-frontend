import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { FlipType, SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { localized } from "../locales/localization";

export default function TakePictureScreen() {
  const [type, setType] = useState(CameraType.front);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imageUri, setImageUri] = useState<any | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const isFocused = useIsFocused();
  const navigation: any = useNavigation<string>();

  const setCameraRef = useCallback((ref: any) => {
    cameraRef.current = ref;
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status === "granted") {
      requestPermission();
    } else {
      requestPermission();
    }
  };
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          {localized.t("WE_NEED_YOUR_PERMISSION_TO_SHOW_THE_CAMERA")}
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef?.current) {
      try {
        setLoading(true);
        const { uri }: CameraCapturedPicture =
          await cameraRef?.current?.takePictureAsync();
        setImageUri(uri);
        const adjustedImage = await manipulateAsync(
          uri,
          [{ flip: FlipType.Horizontal }],
          {
            compress: 1,
            format: SaveFormat.JPEG,
          }
        );
        MediaLibrary.saveToLibraryAsync(adjustedImage.uri);
        navigation.navigate("DriverPhotoSaveScreen", {
          selectedImage: adjustedImage.uri,
          fromCameraRoll : false,
        });
        setLoading(false);
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
      <Modal visible={loading} animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size={"large"} />
          </View>
        </View>
      </Modal>
      {isFocused && (
        <Camera
          ref={setCameraRef}
          style={styles.camera}
          type={type}
          onCameraReady={requestCameraPermission}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>{localized.t("FLIP_CAMERA")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>{localized.t("CAPTURE")}</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
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
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
