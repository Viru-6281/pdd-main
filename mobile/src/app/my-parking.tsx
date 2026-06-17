import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function MyParking() {
  const { lenderId } = useLocalSearchParams();

  const [parkingPlaces, setParkingPlaces] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchParkingPlaces();
  }, []);

  const fetchParkingPlaces = async () => {
    try {
      const response = await api.get(
        `/parking/place/${lenderId}`
      );

      console.log(
        "MY PARKING:",
        response.data
      );

      setParkingPlaces(
        response.data.parkingPlaces || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteParking = (parkingId: number) => {
    Alert.alert(
      "Delete Parking",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response =
                await api.delete(
                  `/parking/delete/${parkingId}`
                );

              if (
                response.data.success
              ) {
                Alert.alert(
                  "Success",
                  "Parking Deleted"
                );

                fetchParkingPlaces();
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "Unable to delete parking"
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#10b981"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🚗 My Parking Places
      </Text>

      <FlatList
        data={parkingPlaces}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image
  source={{
    uri:
      `${api.defaults.baseURL}/images/${item.image}`,
  }}
  style={styles.image}
/>
            )}

            <Text style={styles.place}>
              {item.placeName}
            </Text>

            <Text style={styles.text}>
              📍 {item.areaName}
            </Text>

            <Text style={styles.text}>
              📝 {item.description}
            </Text>

            <Text style={styles.status}>
              {item.isAvailable
                ? "🟢 Available"
                : "🔴 Occupied"}
            </Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                deleteParking(item.id)
              }
            >
              <Text
                style={styles.btnText}
              >
                Delete Parking
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No Parking Places Found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
    paddingTop: 50,
  },

  title: {
    color: "#10b981",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 10,
  },

  place: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "bold",
  },

  text: {
    color: "#ffffff",
    marginTop: 5,
  },

  status: {
    color: "#fbbf24",
    marginTop: 10,
    fontWeight: "bold",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },

  empty: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 100,
  },

  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
});