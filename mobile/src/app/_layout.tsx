import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="user-login" />
      <Stack.Screen name="lender-login" />
      <Stack.Screen name="user-dashboard" />
      <Stack.Screen name="lender-dashboard" />
  
    </Stack>
  );
}