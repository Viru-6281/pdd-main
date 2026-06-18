import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function LenderStatistics() {
  const { lenderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const [totalParking, setTotalParking] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const parkingRes = await api.get(
        `/parking/place/${lenderId}`
      );

      const bookingRes = await api.get(
        `/booking/lender/${lenderId}`
      );

      const parkingPlaces =
        parkingRes.data.parkingPlaces || [];

      const bookings =
        bookingRes.data.bookings || [];

      setTotalParking(parkingPlaces.length);
      setTotalBookings(bookings.length);

      setAccepted(
        bookings.filter(
          (b: any) =>
            b.status === "Accepted"
        ).length
      );

      setRejected(
        bookings.filter(
          (b: any) =>
            b.status === "Rejected"
        ).length
      );

      setPending(
        bookings.filter(
          (b: any) =>
            b.status === "Pending"
        ).length
      );
    } catch (error) {
      console.log(
        "STATISTICS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        📊 Statistics
      </Text>

      <View style={styles.card}>
        <Text style={styles.number}>
          {totalParking}
        </Text>
        <Text style={styles.label}>
          Total Parking Places
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          {totalBookings}
        </Text>
        <Text style={styles.label}>
          Total Bookings
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          {accepted}
        </Text>
        <Text style={styles.label}>
          Accepted Bookings
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          {rejected}
        </Text>
        <Text style={styles.label}>
          Rejected Bookings
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          {pending}
        </Text>
        <Text style={styles.label}>
          Pending Bookings
        </Text>
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

  title: {
    color: "#10b981",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 25,
    marginBottom: 15,
    alignItems: "center",
  },

  number: {
    color: "#10b981",
    fontSize: 40,
    fontWeight: "bold",
  },

  label: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 10,
  },

  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
});