import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function MyBookings() {
  const { userId } = useLocalSearchParams();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(
        `/booking/user/${userId}`
      );

      console.log(
        "BOOKINGS:",
        response.data
      );

      setBookings(
        response.data.bookings || []
      );
    } catch (error) {
      console.log(
        "Booking Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "Accepted":
        return "#10b981";

      case "Rejected":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#10b981"
        />

        <Text style={styles.loadingText}>
          Loading Bookings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        📅 My Bookings
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Parking Image */}

            {item.parkingPlace?.image && (
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/images/${item.parkingPlace.image}`,
                }}
                style={styles.image}
              />
            )}

            <Text style={styles.title}>
              {item.parkingPlace?.placeName}
            </Text>

            <Text style={styles.text}>
              📍 Area:{" "}
              {item.parkingPlace?.areaName}
            </Text>

            <Text style={styles.text}>
              🆔 Booking ID: {item.id}
            </Text>

            <Text style={styles.text}>
              🕒 Start:
              {" "}
              {item.startTime}
            </Text>

            <Text style={styles.text}>
              🕒 End:
              {" "}
              {item.endTime}
            </Text>

            <Text style={styles.text}>
              📅 Reserved:
              {" "}
              {item.reservationTime}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    getStatusColor(
                      item.status
                    ),
                },
              ]}
            >
              <Text
                style={styles.statusText}
              >
                {item.status}
              </Text>
            </View>

            <Text
              style={{
                color: item.active
                  ? "#10b981"
                  : "#94a3b8",
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              {item.active
                ? "🟢 Active Booking"
                : "⚪ Expired Booking"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>
              No Bookings Found
            </Text>
          </View>
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
    paddingTop: 55,
  },

  header: {
    color: "#10b981",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },

  title: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  text: {
    color: "#ffffff",
    marginBottom: 6,
    fontSize: 14,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  statusText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#ffffff",
    marginTop: 10,
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 18,
  },
});