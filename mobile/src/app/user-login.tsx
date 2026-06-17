import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import api from "../services/api";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const response = await api.post("/login/user", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS", response.data);

      if (response.data.success) {
        Alert.alert("Success", "Login Successful");

       router.push({
  pathname: "/user-dashboard",
  params: {
    userId: response.data.user.id,
    userName: response.data.user.name,
  },
});
      } else {
        Alert.alert(
          "Login Failed",
          response.data.msg || "Invalid credentials"
        );
      }
    } catch (error: any) {
      console.log("FULL ERROR:", error);

      Alert.alert(
        "Login Failed",
        error?.response?.data?.msg ||
          error?.message ||
          "Unknown Error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 User Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#64748b"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={loginUser}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/user-register")}
      >
        <Text style={styles.link}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f172a",
  },

  title: {
    fontSize: 30,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    color: "#10b981",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
});