import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LenderRegister() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Lender Register Page
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});