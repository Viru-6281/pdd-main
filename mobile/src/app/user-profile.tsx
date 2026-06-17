import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  useLocalSearchParams,
  router,
} from "expo-router";
import api from "../services/api";

export default function UserProfile() {
  const { userId } =
    useLocalSearchParams();

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response =
        await api.get(`/user/${userId}`);

      setUser(response.data.user);
    } catch (error) {
      console.log(error);
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
      <Image
        source={{
          uri: user?.image
            ? `${api.defaults.baseURL}/images/${user.image}`
            : "https://via.placeholder.com/150",
        }}
        style={styles.profileImage}
      />

      <Text style={styles.name}>
        {user?.name}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Email
        </Text>
        <Text style={styles.value}>
          {user?.email}
        </Text>

        <Text style={styles.label}>
          Mobile
        </Text>
        <Text style={styles.value}>
          {user?.mobileNumber}
        </Text>

        <Text style={styles.label}>
          Address
        </Text>
        <Text style={styles.value}>
          {user?.address}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/edit-user-profile",
            params: {
              userId,
            },
          })
        }
      >
        <Text style={styles.buttonText}>
          Edit Profile
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  name: {
    color: "#10b981",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
  },

  label: {
    color: "#94a3b8",
    marginTop: 10,
  },

  value: {
    color: "#fff",
    fontSize: 17,
    marginTop: 5,
  },

  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});