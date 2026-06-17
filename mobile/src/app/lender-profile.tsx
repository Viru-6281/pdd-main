import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function LenderProfile() {
  const { lenderId } = useLocalSearchParams();

  const [lender, setLender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("LENDER ID:", lenderId);

      const response = await api.get(
        `/lender/${lenderId}`
      );

      console.log(
        "PROFILE RESPONSE:",
        response.data
      );

      setLender(response.data.lender);
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
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
        <Text style={styles.loadingText}>
          Loading Profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        👤 Lender Profile
      </Text>

      {lender?.image ? (
        <Image
          source={{
            uri: `http://YOUR_IP:8080/images/${lender.image}`,
          }}
          style={styles.image}
        />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            👤
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>
          Name
        </Text>
        <Text style={styles.value}>
          {lender?.name || "N/A"}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>
        <Text style={styles.value}>
          {lender?.email || "N/A"}
        </Text>

        <Text style={styles.label}>
          Mobile Number
        </Text>
        <Text style={styles.value}>
          {lender?.mobileNumber || "N/A"}
        </Text>

        <Text style={styles.label}>
          Address
        </Text>
        <Text style={styles.value}>
          {lender?.address || "N/A"}
        </Text>

        <Text style={styles.label}>
          Lender ID
        </Text>
        <Text style={styles.value}>
          {lender?.id}
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
    marginBottom: 25,
  },

  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 25,
  },

  avatarText: {
    fontSize: 60,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 20,
  },

  label: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  value: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
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
});