import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import api from "../services/api";

export default function UserRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const response = await api.post("/user/signup", {
        name,
        email,
        password,
        mobileNumber,
        address,
      });

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Registration Successful"
        );

        router.push("/user-login");
      }
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.title}>
        User Registration
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#64748b"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#64748b"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#64748b"
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />

      <TextInput
        placeholder="Address"
        placeholderTextColor="#64748b"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#64748b"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={registerUser}
      >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/user-login")
        }
      >
        <Text style={styles.link}>
          Already have an account? Login
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

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    color: "#10b981",
    textAlign: "center",
    marginTop: 20,
  },
});