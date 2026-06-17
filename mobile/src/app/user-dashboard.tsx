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
import { router, useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function UserDashboard() {
  const [parkingPlaces, setParkingPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { userId, userName } = useLocalSearchParams();

  useEffect(() => {
    fetchParkingPlaces();
  }, []);

  const fetchParkingPlaces = async () => {
    try {
      const response = await api.get("/parking");

      setParkingPlaces(
        response.data.parkingPlace || []
      );
    } catch (error) {
      console.log("Parking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToBookings = () => {
    router.push({
      pathname: "/my-bookings",
      params: { userId },
    });
  };

  const goToProfile = () => {
    router.push({
      pathname: "/user-profile",
      params: { userId },
    });
  };

 
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#10b981"
        />
        <Text style={styles.loadingText}>
          Loading Parking Places...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Welcome Card */}
      <View style={styles.headerCard}>
        <Text style={styles.welcomeText}>
          👋 Welcome Back
        </Text>

        <Text style={styles.userName}>
          {userName || "User"}
        </Text>

        <Text style={styles.subText}>
          Find and reserve parking spaces easily
        </Text>

        <Text style={styles.countText}>
          🚗 {parkingPlaces.length} Parking Places Available
        </Text>
      </View>

      {/* Top Actions */}
      <View style={styles.topCards}>
        <TouchableOpacity
          style={styles.bookingCard}
          onPress={goToBookings}
        >
          <Text style={styles.actionIcon}>
            📅
          </Text>

          <Text style={styles.actionText}>
            My Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileCard}
          onPress={goToProfile}
        >
          <Text style={styles.actionIcon}>
            👤
          </Text>

          <Text style={styles.actionText}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutCard}
          onPress={logout}
        >
          <Text style={styles.actionIcon}>
            🚪
          </Text>

          <Text style={styles.actionText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>
        🚗 Available Parking
      </Text>

      <FlatList
        data={parkingPlaces}
        keyExtractor={(item: any) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `${api.defaults.baseURL}/images/${item.image}`,
              }}
              style={styles.parkingImage}
            />

            <Text style={styles.cardTitle}>
              {item.placeName}
            </Text>

            <Text style={styles.cardText}>
              📍 {item.areaName}
            </Text>

            <Text style={styles.cardText}>
              📝 {item.description}
            </Text>

            <Text style={styles.cardText}>
              👤 {item.lender?.name}
            </Text>

            <Text style={styles.cardText}>
              📧 {item.lender?.email}
            </Text>

            <Text style={styles.cardText}>
              📱 {item.lender?.mobileNumber}
            </Text>

            <View
              style={[
                styles.statusBadge,
                item.available || item.isAvailable
                  ? styles.availableBadge
                  : styles.occupiedBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {item.available ||
                item.isAvailable
                  ? "AVAILABLE"
                  : "OCCUPIED"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                router.push({
                  pathname:
                    "/parking-details",
                  params: {
                    userId,
                    parkingId: item.id,
                    lenderId:
                      item.lender?.id,

                    placeName:
                      item.placeName,
                    areaName:
                      item.areaName,
                    description:
                      item.description,
                    image: item.image,

                    lenderName:
                      item.lender?.name,
                    lenderEmail:
                      item.lender?.email,
                    mobileNumber:
                      item.lender?.mobileNumber,

                    latitude:
                      item.latitude,
                    longitude:
                      item.longitude,
                  },
                })
              }
            >
              <Text style={styles.btnText}>
                View & Reserve
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              🚗 No Parking Places Available Yet
            </Text>
          </View>
        }
      />
    </View>
  );
}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 15,
    paddingTop: 55,
  },

  headerCard: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },

  welcomeText: {
    color: "#94a3b8",
    fontSize: 16,
  },

  userName: {
    color: "#10b981",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },

  subText: {
    color: "#cbd5e1",
    marginTop: 8,
  },

  countText: {
    color: "#10b981",
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 15,
  },

  topCards: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  bookingCard: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },

  profileCard: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },

  logoutCard: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  header: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },

  parkingImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 12,
  },

  cardTitle: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardText: {
    color: "#e2e8f0",
    marginBottom: 4,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },

  availableBadge: {
    backgroundColor: "#10b981",
  },

  occupiedBadge: {
    backgroundColor: "#ef4444",
  },

  statusText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  bookButton: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
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
    marginTop: 100,
    alignItems: "center",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 18,
  },
});