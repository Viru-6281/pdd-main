import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Parking</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/user-login")}
      >
        <Text style={styles.buttonText}>
          Login as User
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/lender-login")}
      >
        <Text style={styles.buttonText}>
          Login as Lender
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "white",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});