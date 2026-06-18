import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function LenderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { lenderId } = useLocalSearchParams();

  useEffect(() => {
    if (lenderId) {
      fetchBookings();
    }
  }, [lenderId]);

  const fetchBookings = async () => {
    try {
      console.log("CURRENT LENDER:", lenderId);

      const response = await api.get(
        `/booking/lender/${lenderId}`
      );

      console.log(
        "LENDER BOOKINGS:",
        response.data
      );

      setBookings(
        response.data.bookings || []
      );
    } catch (error) {
      console.log(
        "BOOKINGS ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    bookingId: number,
    status: string
  ) => {
    try {
      const response = await api.post(
        `/booking/update/status/${bookingId}`,
        null,
        {
          params: {
            status,
          },
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          `Booking ${status}`
        );

        fetchBookings();
      }
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to update booking"
      );
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
      <Text style={styles.title}>
        🚗 Parking Bookings
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.place}>
              {item.parkingPlace?.placeName}
            </Text>

            <Text style={styles.text}>
              👤 User: {item.user?.name}
            </Text>

            <Text style={styles.text}>
              📧 Email: {item.user?.email}
            </Text>

            <Text style={styles.text}>
              🕒 Start: {item.startTime}
            </Text>

            <Text style={styles.text}>
              🕒 End: {item.endTime}
            </Text>

            <Text style={styles.status}>
              Status: {item.status}
            </Text>

            {item.status === "Pending" && (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() =>
                    updateStatus(
                      item.id,
                      "Accepted"
                    )
                  }
                >
                  <Text style={styles.btnText}>
                    Accept
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() =>
                    updateStatus(
                      item.id,
                      "Rejected"
                    )
                  }
                >
                  <Text style={styles.btnText}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>
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
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },

  place: {
    color: "#10b981",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  text: {
    color: "#ffffff",
    fontSize: 15,
    marginBottom: 5,
  },

  status: {
    color: "#fbbf24",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    marginTop: 15,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 10,
    marginRight: 5,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginLeft: 5,
  },

  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  empty: {
    color: "#ffffff",
    fontSize: 18,
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
    fontSize: 16,
  },
});