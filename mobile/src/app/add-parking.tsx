import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "../services/api";

export default function AddParking() {
  const { lenderId } = useLocalSearchParams();

  const [placeName, setPlaceName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const addParking = async () => {
    if (
      !placeName ||
      !areaName ||
      !latitude ||
      !longitude ||
      !image
    ) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields and select an image"
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("placeName", placeName);
      formData.append("areaName", areaName);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("description", description);

      formData.append("image", {
        uri: image.uri,
        name: "parking.jpg",
        type: "image/jpeg",
      } as any);

      console.log("LENDER ID:", lenderId);

      const response = await api.post(
        `/parking/${lenderId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "ADD PARKING:",
        response.data
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Parking Added Successfully"
        );

        router.back();
      } else {
        Alert.alert(
          "Failed",
          response.data.msg
        );
      }
    } catch (error: any) {
      console.log(
        "ADD PARKING ERROR:",
        error.response?.data
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          "Unable to add parking"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        🚗 Add Parking Place
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Place Name"
        placeholderTextColor="#94a3b8"
        value={placeName}
        onChangeText={setPlaceName}
      />

      <TextInput
        style={styles.input}
        placeholder="Area Name"
        placeholderTextColor="#94a3b8"
        value={areaName}
        onChangeText={setAreaName}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitude"
        placeholderTextColor="#94a3b8"
        value={latitude}
        onChangeText={setLatitude}
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        placeholderTextColor="#94a3b8"
        value={longitude}
        onChangeText={setLongitude}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Description"
        placeholderTextColor="#94a3b8"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          Select Parking Image
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.preview}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={addParking}
      >
        <Text style={styles.buttonText}>
          Add Parking
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },

  header: {
    color: "#10b981",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  imageButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});