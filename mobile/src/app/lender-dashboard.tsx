import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

export default function LenderDashboard() {
  const { lenderId, lenderName } =
    useLocalSearchParams();

  const logout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => router.replace("/"),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.welcome}>
          👋 Welcome Back
        </Text>

        <Text style={styles.name}>
          {lenderName || "Lender"}
        </Text>

        <Text style={styles.subtitle}>
          Manage your parking spaces and bookings
        </Text>
      </View>

      {/* Dashboard Buttons */}

      <TouchableOpacity
        style={[styles.card, styles.greenCard]}
        onPress={() =>
          router.push({
            pathname: "/add-parking",
            params: { lenderId },
          })
        }
      >
        <Text style={styles.icon}>🚗</Text>

        <View>
          <Text style={styles.cardTitle}>
            Add Parking
          </Text>

          <Text style={styles.cardDesc}>
            Create a new parking space
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.blueCard]}
        onPress={() =>
          router.push({
            pathname: "/lender-bookings",
            params: { lenderId },
          })
        }
      >
        <Text style={styles.icon}>📅</Text>

        <View>
          <Text style={styles.cardTitle}>
            View Bookings
          </Text>

          <Text style={styles.cardDesc}>
            Manage user reservations
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.purpleCard]}
        onPress={() =>
          router.push({
            pathname: "/lender-profile",
            params: { lenderId },
          })
        }
      >
        <Text style={styles.icon}>👤</Text>

        <View>
          <Text style={styles.cardTitle}>
            Profile
          </Text>

          <Text style={styles.cardDesc}>
            View account details
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.card, styles.tealCard]}
  onPress={() =>
    router.push({
      pathname: "/my-parking",
      params: { lenderId },
    })
  }
>
  <Text style={styles.icon}>🏢</Text>

  <View>
    <Text style={styles.cardTitle}>
      My Parking Places
    </Text>

    <Text style={styles.cardDesc}>
      View and manage your parking spaces
    </Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.orangeCard]}
        onPress={() =>
          router.push({
            pathname: "/lender-statistics",
            params: { lenderId },
          })
        }
      >
        <Text style={styles.icon}>📊</Text>

        <View>
          <Text style={styles.cardTitle}>
            Statistics
          </Text>

          <Text style={styles.cardDesc}>
            Booking analytics
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.redCard]}
        onPress={logout}
      >
        <Text style={styles.icon}>🚪</Text>

        <View>
          <Text style={styles.cardTitle}>
            Logout
          </Text>

          <Text style={styles.cardDesc}>
            Sign out of account
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  headerCard: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#334155",
  },
  tealCard: {
  backgroundColor: "#14b8a6",
},

  welcome: {
    color: "#94a3b8",
    fontSize: 16,
  },

  name: {
    color: "#10b981",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 10,
    fontSize: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    borderRadius: 20,
    marginBottom: 15,
  },

  icon: {
    fontSize: 35,
    marginRight: 20,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  cardDesc: {
    color: "#e2e8f0",
    marginTop: 4,
  },

  greenCard: {
    backgroundColor: "#10b981",
  },

  blueCard: {
    backgroundColor: "#3b82f6",
  },

  purpleCard: {
    backgroundColor: "#8b5cf6",
  },

  orangeCard: {
    backgroundColor: "#f59e0b",
  },

  redCard: {
    backgroundColor: "#ef4444",
  },
});