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

export default function LenderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await api.post(
        "/login/lender",
        {
          email,
          password,
        }
      );

      console.log(
        "LENDER LOGIN:",
        response.data
      );

      if (response.data.success) {
        const lender =
          response.data.lender;

        Alert.alert(
          "Success",
          "Login Successful"
        );

        router.push({
          pathname: "/lender-dashboard",
          params: {
            lenderId: lender.id,
            lenderName: lender.name,
          },
        });
      }
    } catch (error: any) {
      console.log(
        "LOGIN ERROR:",
        error?.response?.data
      );

      Alert.alert(
        "Login Failed",
        error?.response?.data?.msg ||
          "Invalid Credentials"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🚗 Lender Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 25,
  },

  title: {
    color: "#10b981",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
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
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});