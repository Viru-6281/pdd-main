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
  Linking,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../services/api";

export default function ParkingDetails() {
  const {
    userId,
    lenderId,
    placeName,
    areaName,
    description,
    image,
    lenderName,
    lenderEmail,
    mobileNumber,
    latitude,
    longitude,
  } = useLocalSearchParams();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const openMaps = () => {
    Linking.openURL(
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );
  };

  const bookParking = async () => {
    if (!date || !startTime || !endTime) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields"
      );
      return;
    }

    try {
      const startDateTime =
        `${date}T${startTime}:00`;

      const endDateTime =
        `${date}T${endTime}:00`;

      const response = await api.post(
        `/booking/parking/${lenderId}/book`,
        null,
        {
          params: {
            userId,
            startTime: startDateTime,
            endTime: endDateTime,
          },
        }
      );

      console.log(
        "BOOKING RESPONSE:",
        response.data
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Parking Booked Successfully"
        );

        router.push({
          pathname: "/my-bookings",
          params: { userId },
        });
      } else {
        Alert.alert(
          "Booking Failed",
          response.data.msg
        );
      }
    } catch (error: any) {
      console.log(
        "BOOKING ERROR:",
        error.response?.data
      );

      Alert.alert(
        "Booking Failed",
        error.response?.data?.msg ||
          "Unable to book parking"
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <Image
        source={{
          uri: `${api.defaults.baseURL}/images/${image}`,
        }}
        style={styles.parkingImage}
      />

      <Text style={styles.header}>
        🚗 {placeName}
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Parking Information
        </Text>

        <Text style={styles.infoText}>
          📍 {areaName}
        </Text>

        <Text style={styles.infoText}>
          📝 {description}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Lender Information
        </Text>

        <Text style={styles.infoText}>
          👤 {lenderName}
        </Text>

        <Text style={styles.infoText}>
          📧 {lenderEmail}
        </Text>

        <Text style={styles.infoText}>
          📱 {mobileNumber}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mapsButton}
        onPress={openMaps}
      >
        <Text style={styles.buttonText}>
          📍 Open in Google Maps
        </Text>
      </TouchableOpacity>

      <View style={styles.bookingCard}>
        <Text style={styles.bookingTitle}>
          Booking Details
        </Text>

        <Text style={styles.label}>
          Booking Date
        </Text>

        <TextInput
          style={styles.input}
          placeholder="2026-06-18"
          placeholderTextColor="#94a3b8"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>
          Start Time
        </Text>

        <TextInput
          style={styles.input}
          placeholder="10:00"
          placeholderTextColor="#94a3b8"
          value={startTime}
          onChangeText={setStartTime}
        />

        <Text style={styles.label}>
          End Time
        </Text>

        <TextInput
          style={styles.input}
          placeholder="12:00"
          placeholderTextColor="#94a3b8"
          value={endTime}
          onChangeText={setEndTime}
        />

        <View style={styles.infoBox}>
          <Text style={styles.example}>
            Example:
          </Text>

          <Text style={styles.example}>
            Date: 2026-06-18
          </Text>

          <Text style={styles.example}>
            Start: 10:00
          </Text>

          <Text style={styles.example}>
            End: 12:00
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={bookParking}
        >
          <Text style={styles.buttonText}>
            Reserve Parking
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },

  parkingImage: {
    width: "100%",
    height: 230,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  header: {
    color: "#10b981",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  infoTitle: {
    color: "#10b981",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  infoText: {
    color: "#ffffff",
    fontSize: 15,
    marginBottom: 8,
  },

  mapsButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  bookingCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
  },

  bookingTitle: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#334155",
    color: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  infoBox: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#10b981",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  example: {
    color: "#10b981",
    marginBottom: 5,
  },

  bookButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});